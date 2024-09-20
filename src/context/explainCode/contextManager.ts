import React, { useContext,  createContext } from 'react';
import { ExplainCodeManager } from './explainCodeManager';


export interface IExplainCodeContext {
    explainCodeManager: ExplainCodeManager;
}
export const ExplainCodeContext = createContext<IExplainCodeContext | undefined>(undefined);


export function useExplainCodeContext(): IExplainCodeContext{
    const value =  useContext(ExplainCodeContext);
    if (!value) {
        throw new Error('Cannot use Explain Code context');
    }
    return value;
}

export function createExplainCodeContext(): IExplainCodeContext {
    return {
        explainCodeManager: new ExplainCodeManager(),
    };
}