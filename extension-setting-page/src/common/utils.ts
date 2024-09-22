
export type UrlKeyType = 'chatgpt' | 'baidu' | 'aili' | 'doubao' | 'kimi' | 'ollama';
export const options: UrlKeyType[] = ['chatgpt', 'baidu', 'aili', 'doubao', 'kimi', 'ollama'];

export function mapModelName(model: UrlKeyType) {
    switch (model) {
        case 'chatgpt': return 'Chat gpt';
        case 'aili': return '通义千问';
        case 'baidu': return '文心一言';
        case 'doubao': return '豆包';
        case 'kimi': return 'Kimi';
        case 'ollama': return '本地(ollama)';
    }
}

export function mapModelList(model: UrlKeyType): string[] {
    switch (model) {
        case 'chatgpt': return ['gpt-3.5-turbo'];
        case 'aili': return ['qwen2-72b-instruct', 'qwen2-57b-a14b-instruct', 'qwen2-7b-instruct', 'qwen2-1.5b-instruct', 'qwen2-0.5b-instruct', 'qwen2.5-72b-instruct', 'qwen2.5-32b-instruct', 'qwen2.5-14b-instruct', 'qwen2.5-7b-instruct', 'qwen2.5-3b-instruct', 'qwen2.5-1.5b-instruct', 'qwen2.5-0.5b-instruct',];
        case 'baidu': return ['ERNIE-4.0-8K', 'Gemma-7B-it', 'Meta-Llama-3-70B-Instruct'];
        case 'doubao': return ['Doubao-pro-32k', 'Doubao-pro-4k', 'Doubao-lite-4k'];
        case 'kimi': return ['moonshot-v1-8k'];
        case 'ollama': return ['llama3'];
    }
    return [];
}

export const storageId = 'explaincodeextensionmodel';