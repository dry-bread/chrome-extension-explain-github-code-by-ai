import { BehaviorSubject, Observable } from 'rxjs';
import { fetchExplainCodeAiResponse, insertCodeAsideBlock } from '../../utils/explainCodeHelper';
import { getAllCodeElementList } from '../../utils/queryCodeDomHelper';

export class ExplainCodeManager {
    private _popoverMessage$ = new BehaviorSubject<string | undefined>(undefined);
    private _enableLoad$ = new BehaviorSubject<boolean>(false);
    private _codeBlocksSet = new Set<Element>();// key,block
    private _allCodeTargetList$ = new BehaviorSubject<Element[]>([]);
    private _observerInView: IntersectionObserver | undefined;
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
    private async explainCode(block: Element) {
        if (block.textContent && block.textContent.trim().length > 0) {
            const explanation = await fetchExplainCodeAiResponse(block.textContent!);
            if (explanation) {
                const explainEle = insertCodeAsideBlock(block, explanation);
                this._codeBlocksSet.add(explainEle);
            }
        }
    }

    private triggerExpalainingCode() {
        this._observerInView = new IntersectionObserver(
            (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // 处理该元素，比如懒加载内容或处理新的 <code> 元素
                        this.explainCode(entry.target as Element);

                        // 如果你只想处理一次，可以在处理后停止观察
                        observer.unobserve(entry.target);
                    }
                });
            }, {
            root: null, // 使用浏览器视口作为根
            rootMargin: '20px', // 视口边缘的扩展区域
            threshold: 0.1 // 目标元素进入视口 10% 时触发
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
        const allElements = this._codeBlocksSet.values();
        Array.from(allElements).forEach((element) => {
            if (element) {
                element.remove();
            }
            this._codeBlocksSet.delete(element);
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