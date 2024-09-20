import React from 'react';
import { Observable } from 'rxjs';


export interface IUseObservableValueOptions<TSource, TDest, TErrorDest> {
    initialValue?: TSource | (() => TSource);
    initialSelectedValue?: TDest | (() => TDest);
    selector?: (value: TSource) => TDest;
    isEqual?: ((x: TDest | TErrorDest, y: TDest | TErrorDest) => boolean) | 'strict-equal';
    onError?: (error: unknown) => TErrorDest;
    /**
     * Determines whether to re-initialize dest value with `initialValue` or `initialSelectedValue`,
     * when the source `observable` reference changed.
     */
    observableTriggerdInitialization?: 'none' | 'auto' | 'always';
}

/**
 * triggers state update when a new value has been observed from the specified `Observable<T>`.
 */
export function useObservableValue<T>(observable: Observable<T> | undefined, initialValue?: () => T): T {
    const options = { initialValue, };
    const observableRef = React.useRef<Observable<T> | undefined>(observable);
    function getInitialSelectedValue(): T | undefined {
        if (options.initialValue) {
            const v = options.initialValue();
            return v as unknown as T;
        }
        return undefined;
    }
    // currentValue CAN be undefined if user has not specified `initialValue` callback.
    const [currentValue, setCurrentValue] = React.useState<T>(() => getInitialSelectedValue()!);

    React.useEffect(() => {
        // This is the latest value provided to the subscription. Keep it in the closure so we don't need another ref.
        let lastValue: T = currentValue;
        const isEqual = (x: unknown, y: unknown) => x === y;
        if (observableRef.current !== observable) {
            // Do the observable-triggered re-initialization
            observableRef.current = observable;
            if ('initialValue' in options) {
                const v2 = getInitialSelectedValue()!;
                if (!isEqual(lastValue, v2)) {
                    lastValue = v2;
                    setCurrentValue(v2);
                }
            }
        }
        if (!observable) {
            return undefined;
        }
        // subscribe for further changes.
        const subscription = observable.subscribe({
            next(v: T): void {
                const v2 = v as unknown as T;
                if (!isEqual(lastValue, v2)) {
                    lastValue = v2;
                    setCurrentValue(v2);
                }
            },
            error: (err) => {
                console.error('Observable subscription error:', err);
            },
        });
        return () => subscription.unsubscribe();
        // does not include currentValue since we don't want to unsubscribe/subscribe every time when value changes.
    }, [observable]);
    return currentValue;
}