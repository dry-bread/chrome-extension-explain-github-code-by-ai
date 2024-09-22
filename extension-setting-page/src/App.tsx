import { Stack } from '@fluentui/react';
import './App.css'
import { makeStyles, Dropdown, OptionOnSelectData, Option, Link } from "@fluentui/react-components";
import { useEffect, useState } from 'react';
import React from 'react';
import { AiModeSetting } from './llmModelSetting/AiModeSetting';
import { mapModelName, options, UrlKeyType } from './common/utils';

const useStyle = makeStyles({
  settingPage: {
    padding: '10px',
    backgroundColor: 'var(--background-color)',
    color: 'var(--text-color)',
  },
  title: {
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '20px',
    color: 'var(--text-color)',
    width: '100%'
  },
  link: {
    color: 'blue',
  },
  item: {
    width: '100%',
  },
  lable: {
    fontWeight: 500,
    fontSize: '16px',
    lineHeight: '20px',
    marginRight: '10px',
    color: 'var(--text-color)',
  },
  input: {
    border: '1px var(--border-color) solid',
    borderBottomColor: 'var(--border-bottom-color)',
    backgroundColor: 'var(--input-background-color)',
    width: '100%',
    borderRadius: '5px',
    minWidth: '1px',
    fontSize: '16px',
    lineHeight: '20px',
    padding: '5px',
    color: 'var(--text-color)',
  },
  option: {
    backgroundColor: 'var(--option-background-color)',
    fontSize: '14px',
    lineHeight: '18px',
    padding: '3px',
    width: 'fit-content',
    minHeight: '30px',
    color: 'var(--text-color)',
    '&:hover': {
      backgroundColor: 'var(--option-hover-background-color)',
      border: '1px var(--option-hover-border-color) solid',
    },
  }
});

const applyTheme = (isDarkMode: boolean) => {
  const root = document.documentElement;
  if (isDarkMode) {
    root.style.setProperty('--background-color', '#1e1e1e');
    root.style.setProperty('--text-color', '#ffffff');
    root.style.setProperty('--border-color', '#444444');
    root.style.setProperty('--border-bottom-color', '#888888');
    root.style.setProperty('--input-background-color', '#2d2d2d');
    root.style.setProperty('--option-background-color', '#2d2d2d');
    root.style.setProperty('--option-hover-background-color', '#3d3d3d');
    root.style.setProperty('--option-hover-border-color', '#ffffff');
  } else {
    root.style.setProperty('--background-color', '#ffffff');
    root.style.setProperty('--text-color', '#000000');
    root.style.setProperty('--border-color', '#d6d6d6');
    root.style.setProperty('--border-bottom-color', '#616161');
    root.style.setProperty('--input-background-color', 'white');
    root.style.setProperty('--option-background-color', 'white');
    root.style.setProperty('--option-hover-background-color', 'lightgray');
    root.style.setProperty('--option-hover-border-color', 'black');
  }
};

const App: React.FC = () => {
  const [aiProduct, setAIProduct] = useState<UrlKeyType | undefined>(undefined);
  const dropdownRef = React.useRef<HTMLButtonElement | null>(null);
  const [optionWidth, setOptionWidth] = useState<number | string | undefined>(undefined);

  // 当组件挂载或窗口大小改变时获取 Dropdown 的宽度
  useEffect(() => {
    if (dropdownRef.current) {
      const width = dropdownRef.current.getBoundingClientRect().width;
      setOptionWidth(width);
      console.log('Dropdown 宽度:', width);
    }
  }, []);
  // 加载已保存的 API Key
  const styles = useStyle();
  const modelCategory = React.useMemo(() => {
    if (aiProduct) {
      return mapModelName(aiProduct);
    }
    return '';
  }, [aiProduct]);

  const selectedOptions = React.useMemo(() => {
    if (aiProduct) {
      return [aiProduct];
    }
    return [];
  }, [aiProduct]);

  React.useEffect(() => {
    setAIProduct(options[0]);
    chrome.storage.sync.get('explaincodeextensionmodel', function (data) {
      const lastData = data.explaincodeextensionmodel;
      if (lastData.product && options.includes(lastData.product)) {
        setAIProduct(lastData.product);
      } else {
        setAIProduct(options[0]);
      }
    });
  }, []);

  React.useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleThemeChange = (e: MediaQueryListEvent) => {
      const newIsDarkMode = e.matches;
      applyTheme(newIsDarkMode);
    };

    // 初始应用主题
    applyTheme(darkModeMediaQuery.matches);

    // 监听主题变化
    darkModeMediaQuery.addEventListener('change', handleThemeChange);

    return () => {
      darkModeMediaQuery.removeEventListener('change', handleThemeChange);
    };
  }, []);

  return (<Stack verticalAlign='start' horizontalAlign='start' className={styles.settingPage} tokens={{ childrenGap: 20 }}>
    <Stack className={styles.title} horizontal horizontalAlign='space-between'>
      <Stack.Item>配置AI大语言模型</Stack.Item>
      <Stack.Item className={styles.link}>
        <Link
          onClick={() => {
            chrome.tabs.create({ url: "https://blog.manxiaozhi.com/articles/2024/09/22/1726999187806.html" })
          }}
          href="https://blog.manxiaozhi.com/articles/2024/09/22/1726999187806.html"
        >
          如何配置？
        </Link>
      </Stack.Item>
    </Stack>
    <Stack horizontalAlign='start' horizontal className={styles.item}>
      <Stack.Item disableShrink className={styles.lable}>选择产品: </Stack.Item>
      <Stack.Item grow>
        <Dropdown
          className={styles.input}
          value={modelCategory}
          ref={dropdownRef} // 将 ref 绑定到 Dropdown 上
          selectedOptions={selectedOptions}
          onOptionSelect={(_e, data: OptionOnSelectData) => {
            if (data.optionValue) {
              setAIProduct(data.optionValue as UrlKeyType);
            }
          }}
        >
          {options.map((option) => (
            <Option key={option} className={styles.option} value={option} style={{ width: optionWidth }}>
              {mapModelName(option)}
            </Option>
          ))}
        </Dropdown>
      </Stack.Item>
    </Stack>
    {aiProduct && <AiModeSetting aiProduct={aiProduct} />}
  </Stack>);
}

export default App
