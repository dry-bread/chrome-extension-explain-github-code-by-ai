import { Stack } from "@fluentui/react";
import { Button, Dropdown, Input, makeStyles, Option, OptionOnSelectData } from "@fluentui/react-components";
import { useState } from "react";
import { SaveRegular } from '@fluentui/react-icons';
import React from "react";
import { mapModelList, UrlKeyType } from "../common/utils";

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
    button: {
        backgroundColor: '#1f883d',
        color: 'white',
        borderRadius: '5px',
        height: '28px',
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

interface AiModeSettingProps {
    aiProduct: UrlKeyType,
}

export const AiModeSetting: React.FC<AiModeSettingProps> = (props) => {
    const { aiProduct } = props;
    const styles = useStyle();
    const [key, setKey] = useState<string>('');
    const [model, setModel] = useState<string>('');
    const [status, setStatus] = useState<string>('');

    React.useEffect(() => {
        chrome.storage.sync.get('explaincodeextensionmodel', function (data) {
            const lastData = data.explaincodeextensionmodel;
            if (lastData.product && lastData.product === aiProduct) {
                if (lastData.model) {
                    setModel(lastData.model);
                } else {
                    setModel('');
                }
                if (lastData.apiKey) {
                    setKey(lastData.apiKey);
                } else {
                    setKey('');
                }
            }
        });
    }, [aiProduct]);

    const modelsList = React.useMemo(() => {
        const list = mapModelList(aiProduct);
        return list;
    }, [aiProduct]);

    React.useEffect(() => {
        if (modelsList.length && !model.length) {
            setModel(modelsList[0]);
        }
    }, [modelsList, model])

    return (<>
        <Stack tokens={{ childrenGap: 2 }} horizontalAlign='start' className={styles.item} horizontal verticalAlign='center'>
            <Stack.Item disableShrink className={styles.lable}>
                选择模型:
            </Stack.Item>
            <Stack.Item grow>
                <Dropdown
                    className={styles.input}
                    value={model}
                    selectedOptions={[model]}
                    onOptionSelect={(_e, data: OptionOnSelectData) => {
                        if (data.optionValue) {
                            setModel(data.optionValue as string);
                        }
                    }}
                >
                    {
                        modelsList.map((model) => (
                            <Option key={model} className={styles.option} value={model}>
                                {model}
                            </Option>
                        ))
                    }
                </Dropdown>
            </Stack.Item>

        </Stack>
        <Stack tokens={{ childrenGap: 2 }} horizontalAlign='start' className={styles.item} horizontal verticalAlign='center'>
            <Stack.Item disableShrink className={styles.lable}>
                输入Key:
            </Stack.Item>
            <Stack.Item grow>
                <Input
                    value={key}
                    onChange={(_, data) => {
                        setKey(data.value);
                    }}
                    className={styles.input}
                    placeholder="输入你的api key" />
            </Stack.Item>

        </Stack>
        <Stack horizontalAlign='end' className={styles.item}>
            <Button
                id="save"
                onClick={() => {
                    setStatus('正在保存配置...');
                    const apiKey = key;
                    chrome.storage.sync.set({ explaincodeextensionmodel: { product: aiProduct, model, apiKey } }, function () {
                        setStatus('已保存配置!');
                    });
                }}
                className={styles.button}
                icon={<SaveRegular />}
            >保存</Button>
            <p>{status}</p>
        </Stack>
    </>);
}