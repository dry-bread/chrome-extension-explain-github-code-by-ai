import React from "react";
import { useObservableValue } from "../../context/rxjsHelper";
import AskAIPanel from "./AskAIPanel";
import { useAskAIContext } from "../../context/askAi/contextManager";


export const AskAIWindow: React.FC = () => {
    const { askAIManager } = useAskAIContext();
    const isShow = useObservableValue(askAIManager.isShowWindow$, () => askAIManager.isShowWindow);
    return <>{isShow && <AskAIPanel />}</>;
}