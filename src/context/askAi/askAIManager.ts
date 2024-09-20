import { BehaviorSubject, Observable } from 'rxjs';
import { fetchAskAiResponse } from '../../utils/explainCodeHelper';

export class AskAIManager {
    private _isShowWindow$ = new BehaviorSubject<boolean>(false);
    private _loadStatus$ = new BehaviorSubject<'ready' | 'loading' | 'loaded'>('ready');
    private _currentInputContent$ = new BehaviorSubject<string>('');
    private _responseStr$ = new BehaviorSubject<string | undefined>(undefined);
    private _responseErr$ = new BehaviorSubject<string | undefined>(undefined);
    constructor() {
    }

    private async fetchAiAnswer() {
        this._loadStatus$.next('loading');
        const messageStr = this._currentInputContent$.value;
        try {
            const answer = await fetchAskAiResponse(messageStr);
            this._responseStr$.next(answer);
            this._loadStatus$.next('loaded');
            this._responseErr$.next(undefined);
        } catch (err) {
            this._responseErr$.next(String(err));
            this._loadStatus$.next('ready');
        }
    }

    public get isShowWindow(): boolean {
        return this._isShowWindow$.value;
    }

    public get isShowWindow$(): Observable<boolean> {
        return this._isShowWindow$;
    }
    

    public get loadStatu(): 'ready' | 'loading' | 'loaded' {
        return this._loadStatus$.value;
    }

    public get loadStatu$(): Observable<'ready' | 'loading' | 'loaded'> {
        return this._loadStatus$;
    }

    public get answerContent(): string | undefined {
        return this._responseStr$.value;
    }

    public get answerContent$(): Observable<string | undefined> {
        return this._responseStr$;
    }
    public get answerError(): string | undefined {
        return this._responseErr$.value;
    }

    public get answerError$(): Observable<string | undefined> {
        return this._responseErr$;
    }
    public get inputContent(): string {
        return this._currentInputContent$.value;
    }

    public get inputContent$(): Observable<string> {
        return this._currentInputContent$;
    }

    public set inputContent(value: string) {
        this._currentInputContent$.next(value);
    }
    public async askAiByMessage() {
        const message = this._currentInputContent$.value;
        if (message && message.length > 0) {
            await this.fetchAiAnswer();
        } else {
            // clear output
            this._responseStr$.next(undefined);
        }
    }

    public closeAiPanel() {
        this._isShowWindow$.next(false);
    }

    public async openAskAiPanel(message: string) {
        this._currentInputContent$.next(message);
        if (this._isShowWindow$.value === false) {
            this._isShowWindow$.next(true);
        }
        await this.askAiByMessage();
    }
}