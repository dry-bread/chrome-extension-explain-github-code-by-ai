import { BehaviorSubject, Observable } from 'rxjs';
import { fetchExplainCodeAiResponse, insertCodeAsideBlock } from '../../utils/explainCodeHelper';
import { getAllCodeElementList } from '../../utils/queryCodeDomHelper';

export class ExplainCodeManager {
    private _popoverMessage$ = new BehaviorSubject<string | undefined>(undefined);
    private _enableLoad$ = new BehaviorSubject<boolean>(false);
    private _codeBlocksMap = new Map<Element, Element>();// target element, explaination element
    private _allCodeTargetList$ = new BehaviorSubject<Element[]>([]);
    private _observerInView: IntersectionObserver | undefined;
    private _observerContentChange: MutationObserver | undefined;
    private _observerAddDom: MutationObserver | undefined;

    constructor() {
    }

    private registerGetExplainObserver(elements: Element[]) {
        elements.forEach((ele) => {
            if (this._observerInView) {
                this._observerInView.observe(ele);
            }
        });
    }

    private registerCodeElementContentChange(element: Element) {
        if (this._observerContentChange) {
            this._observerContentChange.observe(element, {
                attributes: true,    // 监控属性（如 'value' 属性）的变化
                characterData: true, // 监控文本内容的变化
                subtree: true        // 监控子树的变化
            });
        }
    }

    private async explainCode(block: Element) {
        if (block.textContent && block.textContent.trim().length > 0) {
            const explanation = await fetchExplainCodeAiResponse(block.textContent!);
            if (explanation) {
                const explainEle = insertCodeAsideBlock(block, explanation);
                this._codeBlocksMap.set(block, explainEle);
            }
        }
    }

    private triggerExpalainingCode() {
        this._observerInView = new IntersectionObserver(
            (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting || entry.target.localName === 'textarea') {
                        // 处理该元素，比如懒加载内容或处理新的 <code> 元素
                        this.explainCode(entry.target as Element);
                        // 如果你只想处理一次，可以在处理后停止观察
                        observer.unobserve(entry.target);
                        // 监听变动
                        this.registerCodeElementContentChange(entry.target as Element);
                    }
                });
            }, {
            root: null, // 使用浏览器视口作为根
            rootMargin: '20px', // 视口边缘的扩展区域
            threshold: 0.1 // 目标元素进入视口 10% 时触发
        });

        // 监听代码（程序）更改
        this._observerContentChange = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === 'characterData' || mutation.type === 'attributes') {
                    const target = mutation.target as Element;
                    const explainDiv = this._codeBlocksMap.get(target);
                    explainDiv?.remove();
                    this._codeBlocksMap.delete(target);
                    this.explainCode(target);
                }
            });
        });

        const codeBlocks = getAllCodeElementList();
        this._allCodeTargetList$.next(codeBlocks);
        this.registerGetExplainObserver(codeBlocks);

        this._observerAddDom = new MutationObserver((mutationsList) => {
            mutationsList.forEach(mutation => {
                // 检查是否有子节点被添加
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node instanceof Element) {
                            const codeBlockArr = getAllCodeElementList(node);
                            if (codeBlockArr && codeBlockArr.length) {
                                const allTargets = [...this._allCodeTargetList$.value];
                                allTargets.push(...codeBlockArr);
                                this._allCodeTargetList$.next(allTargets);
                                this.registerGetExplainObserver(codeBlockArr);
                            }
                        }

                    });
                }
            });
        });

        this._observerAddDom.observe(document.body, {
            childList: true,      // 观察直接子节点的添加/删除
            subtree: true         // 观察整个 DOM 树中的变化
        });
    }



    private clearAllCodeBlock() {
        const allElements = this._codeBlocksMap.entries()
        Array.from(allElements).forEach(([target, explainDiv]) => {
            if (explainDiv) {
                explainDiv.remove();
            }
            this._codeBlocksMap.delete(target);
        });
        this._observerInView?.disconnect();
        this._observerAddDom?.disconnect();
    }

    public get enableLoad$(): Observable<boolean> {
        return this._enableLoad$;
    }

    public get enableLoad(): boolean {
        return this._enableLoad$.value;
    }

    public get popoverMessage$(): Observable<string | undefined> {
        return this._popoverMessage$;
    }

    public get popoverMessage(): string | undefined {
        return this._popoverMessage$.value;
    }
    public set popoverMessage(error: string | undefined) {
        this._popoverMessage$.next(error);
    }
    public get hasLoaded(): boolean {
        return this._enableLoad$.value;
    }
    public async triggerExpalinCode() {
        if (this._enableLoad$.value === false) {
            this.triggerExpalainingCode();
            this._enableLoad$.next(true);
        } else {
            // clear all element
            this.clearAllCodeBlock();
            this._enableLoad$.next(false);
        }
    }
}