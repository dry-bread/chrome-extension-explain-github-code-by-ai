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

function recordUsage(product, isSuccess, startTime) {
  const timeStamp = (new Date()).getTime();
  fetch('http://count.manxiaozhi.com/count', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      metricName: 'browser-extension-explain-code',
      records: [
        {
          timestamp: timeStamp,
          product,
          isSuccess,
          delay: timeStamp - startTime,
        }
      ]
    })
  })
    .then(response => {
      // do nothing 
    })
    .catch(error => {
      // do nothing
    });
}


function fetchDataByChatgpt(model, apiKey, content) {
  const aiApiUri = 'https://api.openai.com/v1/chat/completions';

  return fetch(aiApiUri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: [{ role: "user", content, }
      ],
      max_tokens: 1000
    })
  })
    .then(response => response.json())
    .then(result => ({ data: result.choices?.[0].message.content }));
}

function fetchDataBybaidu(model, apiKey, content) {
  const aiApiUri = `https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions_pro?access_token=${apiKey}`;
  return fetch(aiApiUri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: model,
      messages: [{ role: "user", content, }
      ],
      max_output_tokens: 1000
    })
  })
    .then(response => response.json())
    .then(result => ({ data: result.result }));
}

function fetchDataByAli(model, apiKey, content) {
  const aiApiUri = 'https://dashscope.aliyuncs.com/compatible-mode/v1';
  return fetch(aiApiUri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: [{ role: "user", content, }
      ],
      max_tokens: 1000
    })
  })
    .then(response => response.json())
    .then(result => ({ data: result.choices?.[0].message.content }));
}

function fetchDataBydoubao(model, apiKey, content) {
  const aiApiUri = 'https://ark.cn-beijing.volces.com/api/v3';
  return fetch(aiApiUri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: [{ role: "user", content, }
      ],
      max_tokens: 1000
    })
  })
    .then(response => response.json())
    .then(result => ({ data: result.choices?.[0].message.content }));
}

function fetchDataBykimi(model, apiKey, content) {
  const aiApiUri = 'https://api.moonshot.cn/v1';
  return fetch(aiApiUri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: [{ role: "user", content, }
      ],
      max_tokens: 1000
    })
  })
    .then(response => response.json())
    .then(result => ({ data: result.choices?.[0].message.content }));
}

function fetchDataByOllama(model, apiKey, content) {
  const aiApiUri = 'https://api.openai.com/v1/chat/completions';
  return fetch(aiApiUri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: [{ role: "user", content, }
      ],
      max_tokens: 1000
    })
  })
    .then(response => response.json())
    .then(result => ({ data: result.choices?.[0].message.content }));
}

// 从 storage 中获取 API Key 并发送请求
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'fetchAIResponse') {
    const content = message.content;
    chrome.storage.sync.get('explaincodeextensionmodel', function (data) {
      const lastData = data.explaincodeextensionmodel;
      if (lastData.product) {
        if (!lastData.model || !lastData.apiKey) {
          sendResponse({ error: '发送请求失败，请输入模型和key' });
        }
        const startTime = (new Date()).getTime();
        switch (lastData.product) {
          case 'chatgpt': fetchDataByChatgpt(lastData.model, lastData.apiKey, content).then(result => {
            sendResponse(result);
            recordUsage('chatgpt', true, startTime);
          }).catch(error => {
            sendResponse({ error: error.message });
            recordUsage('chatgpt', false, startTime);
          }); break;
          case 'baidu': fetchDataBybaidu(lastData.model, lastData.apiKey, content).then(result => {
            sendResponse(result);
            recordUsage('baidu', true, startTime);
          }).catch(error => {
            sendResponse({ error: error.message });
            recordUsage('baidu', false, startTime);
          }); break;
          case 'aili': fetchDataByAli(lastData.model, lastData.apiKey, content).then(result => sendResponse(result)).catch(error => sendResponse({ error: error.message })); break;
          case 'doubao': fetchDataBydoubao(lastData.model, lastData.apiKey, content).then(result => sendResponse(result)).catch(error => sendResponse({ error: error.message })); break;
          case 'kimi': fetchDataBykimi(lastData.model, lastData.apiKey, content).then(result => sendResponse(result)).catch(error => sendResponse({ error: error.message })); break;
          case 'ollama': fetchDataByOllama(lastData.model, lastData.apiKey, content).then(result => sendResponse(result)).catch(error => sendResponse({ error: error.message })); break;
        }
      } else {
        sendResponse({ error: '发送请求失败，请选择大模型产品' });
      }
    });
    return true; // 表示响应是异步的
  }
});

