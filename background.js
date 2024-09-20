chrome.runtime.onInstalled.addListener(() => {
  console.log("Code Explainer installed!");
});
chrome.contextMenus.create({
  id: "askAI-eplainCode",
  title: "查询AI助手",
  contexts: ["selection"],  // 只在用户选中文字时显示
});
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "askAI-eplainCode") {
    const selectedText = info.selectionText;  // 获取选中的文本
    // 向 content script 发送消息，将选中内容展示在右侧弹框中
    chrome.tabs.sendMessage(tab.id, { action: "askAI-eplainCode-0791197", content: selectedText });
  }
});

const aiApiUri = 'https://api.openai.com/v1/chat/completions';

// 从 storage 中获取 API Key 并发送请求
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'fetchAIResponse') {
    const content = message.content;
    chrome.storage.sync.get('explaincodeextensionmodel', function (data) {
      const lastData = data.explaincodeextensionmodel;
      if (lastData.product && lastData.product === 'chatgpt') {
        fetch(aiApiUri, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${lastData.apiKey}`
          },
          body: JSON.stringify({
            model: lastData.model,
            messages: [{ role: "user", content, }
            ],
            max_tokens: 1000
          })
        })
          .then(response => response.json())
          .then(result => sendResponse({ data: result.choices?.[0].message.content }))
          .catch(error => sendResponse({ error: error.message }));
      } else {
        sendResponse({ error: 'API Key not found' });
      }
    });
    return true; // 表示响应是异步的
  }
});

