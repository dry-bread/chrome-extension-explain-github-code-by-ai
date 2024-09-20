import React, { useContext, createContext } from 'react';
import { AskAIManager } from './askAIManager';


export interface IAskAIContext {
    askAIManager: AskAIManager;
}
export const AskAIContext = createContext<IAskAIContext | undefined>(undefined);


export function useAskAIContext(): IAskAIContext {
    const value = useContext(AskAIContext);
    if (!value) {
        throw new Error('Cannot use Ask AI context');
    }
    return value;
}

export function createAskAIContext(): IAskAIContext {
    return {
        askAIManager: new AskAIManager(),
    };
}