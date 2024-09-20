export function getAllCodeElementList(element?: Element): Array<Element> {
    // 查找页面中的 只有文本内容的 <pre> 元素
    const preBlocks = element ? element.querySelectorAll('pre') : document.querySelectorAll('pre');
    const preOnlyTextBlocks = Array.from(preBlocks).filter((pre) => {
        // 确保 <pre> 包含的文本不是空的或全是空白字符
        const hasNonEmptyText = pre.textContent && pre.textContent.trim().length > 0;
        return hasNonEmptyText;
    });

    // 查找页面中有内容的 <textarea> 元素
    const textAreaBlocks = element ? element.querySelectorAll('textarea') :document.querySelectorAll('textarea');
    const vaildTextAreaBlocks = Array.from(textAreaBlocks).filter((textArea) => {
        // 确保 <textarea> 包含的文本不是空的或全是空白字符
        const hasNonEmptyText = textArea.textContent && textArea.textContent.trim().length > 0;
        // 检查 <textarea> 的所有子节点，确保它们只有文本节点
        return hasNonEmptyText;
    });

    return [...preOnlyTextBlocks, ...vaildTextAreaBlocks];
}