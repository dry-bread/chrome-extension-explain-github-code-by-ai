import { createRoot } from 'react-dom/client';
import { EXPLAINCODEEXTENSIONID } from './common/contants';
import { ExplainCodeExtension } from './components/ExplainCodeExtension';

// 检查是否已经插入到页面
const hasExplainExtension = document.getElementById(EXPLAINCODEEXTENSIONID);

if (!hasExplainExtension) {
  // 创建一个新的 div 作为 React 的渲染容器
  const container = document.createElement('div');
  container.id = 'react-root';

  // 通过设置样式将按钮固定到页面的右下角
  container.style.position = 'fixed';
  container.style.right = '0px';
  container.style.bottom = '20%';
  container.style.zIndex = '1000';

  document.body.appendChild(container);

  // 将组件渲染到页面上
  const root = createRoot(container);
  root.render(<ExplainCodeExtension />);
}

