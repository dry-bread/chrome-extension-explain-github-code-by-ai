
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
        case 'aili': return ['gpt-3.5-turbo'];
        case 'baidu': return ['ERNIE-4.0-8K', 'Gemma-7B-it', 'Meta-Llama-3-70B-Instruct'];
        case 'doubao': return ['gpt-3.5-turbo'];
        case 'kimi': return ['gpt-3.5-turbo'];
        case 'ollama': return ['gpt-3.5-turbo'];
    }
    return [];
}

export const storageId = 'explaincodeextensionmodel';