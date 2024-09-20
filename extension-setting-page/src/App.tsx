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
  },
  title: {
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '20px',
  },
  item: {
    width: '100%',
  },
  lable: {
    fontWeight: 500,
    fontSize: '16px',
    lineHeight: '20px',
    marginRight: '10px',
  },
  input: {
    border: '1px #d6d6d6 solid',
    borderBottomColor: '#616161',
    backgroundColor: 'white',
    width: '100%',
    borderRadius: '5px',
    minWidth: '1px',
    fontSize: '16px',
    lineHeight: '20px',
    padding: '5px',
  },
  option: {
    backgroundColor: 'white',
    fontSize: '14px',
    lineHeight: '18px',
    padding: '3px',
    width: 'fit-content',
    minHeight: '30px',
    '&:hover': {
      backgroundColor: 'lightgray',
      border: '1px black soild',
    },
  }
});

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
