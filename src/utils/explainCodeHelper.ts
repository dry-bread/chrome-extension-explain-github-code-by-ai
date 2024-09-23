import {v4 as uuid} from 'uuid';


async function fetchAiResponse(code: string, agents: { role: string, content: string }[] = []): Promise<string | { error: string } | undefined> {
    const promise = new Promise<string>((resolve) => {
        chrome.runtime.sendMessage({
            action: 'fetchAIResponse',
            content: code,
        }, function (response) {
            if (response.error) {
                const newError = {error: `${response.error} 请检查是否打开vpn或者配置了正确的key`}
                resolve({...response, error: newError});
            } else {
                resolve(response.data);
            }
        });
    })

    return promise;
}

export async function fetchExplainCodeAiResponse(code: string): Promise<string | { error: string } | undefined> {
    const response = await fetchAiResponse("Assuming that you are a chief software engineer, please explain the following code in detail in Chinese.\n" +
        "Requirement: First, briefly summarize the functions of the code file and the functions it contains, and introduce the external libraries/third-party packages/header files introduced in the code (if any), the macro definitions in the code (if any), and the functions and implementation methods of each function in the code in order.\n" +
        "Please give the code analysis results in markdown format in Chinese, English answer is unacceptable: summarize the functions and functions of the code file, the structure of the code file, give other files associated with the code file (if any) according to the introduced external libraries/third-party packages/header files, the macro definitions of the code (if any), and introduce the functions, inputs, outputs and implementation methods of each function respectively (format: [interpreted function definition code]: main function of the function \\br <function parameters>: function parameter definition \\br function implementation method)." + `\n\n ${code}`, [{
        role: "assistant",
        content: "你是一名程序员，能够向用户解释代码"
    }]);
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

