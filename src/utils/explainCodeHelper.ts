import { v4 as uuid } from 'uuid';




async function fetchAiResponse(code: string, agents: { role: string, content: string }[] = []): Promise<string | undefined> {
    const promise = new Promise<string>((resolve) => {
        chrome.runtime.sendMessage({
            action: 'fetchAIResponse',
            content: code,
        }, function (response) {
            if (response.error) {
                resolve(response.error);
            } else {
                resolve(response.data);
            }
        });
    })

    return promise;
}

export async function fetchExplainCodeAiResponse(code: string): Promise<string | undefined> {
    const response = await fetchAiResponse(`精简的解释一下下面代码的作用: \n\n ${code}`, [{ role: "assistant", content: "你是一名程序员，能够向用户解释代码" }]);
    return response;
}

export async function fetchAskAiResponse(code: string): Promise<string | undefined> {
    const response = await fetchAiResponse(code);
    return response;
}

/**
 * return element id
 * @param block : Element
 * @param explaination : string
 */
export function insertCodeAsideBlock(block: Element, explaination: string): Element {
    // 创建新的元素并插入到代码块旁边
    const explanationDiv = document.createElement('div');
    const id = `explain-code-${uuid()}`;
    explanationDiv.id = id;
    explanationDiv.innerText = explaination;
    explanationDiv.style.border = "1px solid #ccc";
    explanationDiv.style.padding = "10px";
    explanationDiv.style.marginTop = "10px";

    // 插入到代码块旁边
    if (block.parentElement) {
        block.parentElement.insertAdjacentElement('afterend', explanationDiv);
    }
    return explanationDiv;
}

