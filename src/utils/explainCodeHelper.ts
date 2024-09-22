import { v4 as uuid } from 'uuid';




async function fetchAiResponse(code: string, agents: { role: string, content: string }[] = []): Promise<string | { error: string } | undefined> {
    const promise = new Promise<string>((resolve) => {
        chrome.runtime.sendMessage({
            action: 'fetchAIResponse',
            content: code,
        }, function (response) {
            if (response.error) {
                const newError = { error: `${response.error} 请检查是否打开vpn或者配置了正确的key` }
                resolve({ ...response, error: newError });
            } else {
                resolve(response.data);
            }
        });
    })

    return promise;
}

export async function fetchExplainCodeAiResponse(code: string): Promise<string | { error: string } | undefined> {
    const response = await fetchAiResponse(`用中文请先总结下列代码的作用，然后再详细解释代码中的各个部分（代码中的部分的定义：共同发挥某个作用的一个模块）（对于每个解释的部分，被解释的代码需要用方括号先列在解释内容的前面，被解释的代码内容用代码原文）. \n\n ${code}`, [{ role: "assistant", content: "你是一名程序员，能够向用户解释代码" }]);
    return response;
}

export async function fetchAskAiResponse(code: string): Promise<string | { error: string } | undefined> {
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

