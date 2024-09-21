import { Stack } from '@fluentui/react';
import './App.css'
import { makeStyles, Dropdown, OptionOnSelectData, Option } from "@fluentui/react-components";
import { useState } from 'react';
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
    chrome.storage.sync.get('explaincodeextensionmodel', function (data) {
      const lastData = data.explaincodeextensionmodel;
      if (lastData.product) {
        setAIProduct(lastData.product);
      } else {
        setAIProduct('chatgpt');
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
    <Stack.Item className={styles.title}>配置AI大语言模型</Stack.Item>
    <Stack horizontalAlign='start' horizontal className={styles.item}>
      <Stack.Item disableShrink className={styles.lable}>选择产品: </Stack.Item>
      <Stack.Item grow>
        <Dropdown
          className={styles.input}
          value={modelCategory}
          selectedOptions={selectedOptions}
          onOptionSelect={(_e, data: OptionOnSelectData) => {
            if (data.optionValue) {
              setAIProduct(data.optionValue as UrlKeyType);
            }
          }}
        >
          {options.map((option) => (
            <Option key={option} className={styles.option} value={option}>
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
