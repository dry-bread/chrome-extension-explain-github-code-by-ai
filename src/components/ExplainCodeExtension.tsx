import React from "react";
import { createExplainCodeContext, ExplainCodeContext, IExplainCodeContext } from "../context/explainCode/contextManager";
import { whiteListHostName } from "../hostFilters";
import ExplainAllCodeBtn from "./button/ExplainAllCodeBtn";
import { AskAIContext, createAskAIContext, IAskAIContext } from "../context/askAi/contextManager";
import { EXPLAINCODEEXTENSIONID } from "../common/contants";
import { AskAIWindow } from "./askAiWindow/AskAIWindow";

export const ExplainCodeExtension: React.FC = () => {
    const [explainCodeContext, SetExplainCodeContext] = React.useState<IExplainCodeContext | undefined>();
    const [askAIContext, SetAskAIContext] = React.useState<IAskAIContext | undefined>();
    const [isGitHub, setIsGitHub] = React.useState<boolean>(false);

    React.useEffect(() => {
        const explainCodeContext = createExplainCodeContext();
        SetExplainCodeContext(explainCodeContext);
        const newAskAiContext = createAskAIContext();
        SetAskAIContext(newAskAiContext);

        const isgithub = whiteListHostName.includes(window.location.hostname);
        setIsGitHub(isgithub);

        const askAiCallback = (message: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
            if (message.action === "askAI-eplainCode-0791197") {
                const selectedText = message.content;
                newAskAiContext.askAIManager.openAskAiPanel(`请用中文解释：${selectedText}`);
            }
        };

        chrome.runtime.onMessage.addListener(askAiCallback);

        return () => chrome.runtime.onMessage.removeListener(askAiCallback);
    }, []);

    return <div id={EXPLAINCODEEXTENSIONID}>
        <ExplainCodeContext.Provider value={explainCodeContext}>
            {isGitHub && <ExplainAllCodeBtn />}
        </ExplainCodeContext.Provider>
        <AskAIContext.Provider value={askAIContext}>
            {askAIContext && <AskAIWindow />}
        </AskAIContext.Provider>
    </div>;
}