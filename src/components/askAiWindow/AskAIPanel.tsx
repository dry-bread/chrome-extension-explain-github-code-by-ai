import { useAskAIContext } from "../../context/askAi/contextManager";
import { Textarea, TextareaOnChangeData, Button } from "@fluentui/react-components";
import { useObservableValue } from "../../context/rxjsHelper";
import { Stack } from '@fluentui/react';
import { DismissRegular, SearchRegular } from '@fluentui/react-icons';
import React from "react";
import { createUseStyles } from 'react-jss';
import { EXPLAINCODEEXTENSIONPANLEID } from "../../common/contants";
// 定义样式
const useStyles = createUseStyles({
    panel: {
        position: 'fixed',
        right: '0px',
        top: '76%',
        height: '22vh',
        width: '268px',
        zIndex: '1000',
        fontSize: '12px',
        lineHeight: '14px',
        border: '1px lightgray  solid',
        borderRadius: 5,
    },
    input: {
        height: '10vh',
        width: '100%',
        fontSize: '12px',
        lineHeight: '14px',
        backgroundColor: '#9CCC65',
        padding: 2,
        paddingBottom: 5,
    },
    textArea: {
        backgroundColor: '#F0FFF0',
        fontSize: '12px',
        lineHeight: '14px',
        height: '100%',
        overflow: 'auto',
        width: '100%',
        minHeight: '1px',
        '> textarea:first-child': {
            minHeight: '1px !important',
        }
    },
    close: {
        height: 10,
        width: '100%',
    },
    answerContent: {
        overflow: 'auto',
        width: '100%',
        fontSize: '12px',
        lineHeight: '14px',
        height: '12vh',
        backgroundColor: '#E0EEE0',
        paddingTop: 5,
    }
});

export const AskAIPanel: React.FC = () => {
    const styles = useStyles();
    const { askAIManager } = useAskAIContext();
    const inputContent = useObservableValue(askAIManager.inputContent$, () => askAIManager.inputContent);
    const answerContent = useObservableValue(askAIManager.answerContent$, () => askAIManager.answerContent);
    const errorMessage = useObservableValue(askAIManager.answerError$, () => askAIManager.answerError);
    const loadStatu = useObservableValue(askAIManager.loadStatu$, () => askAIManager.loadStatu);

    const onChangeInput = React.useCallback((_: any, data: TextareaOnChangeData) => {
        askAIManager.inputContent = data.value;
    }, [askAIManager]);

    return <Stack
        className={styles.panel}
    >
        <Stack horizontal horizontalAlign="end" className={styles.input}>
            <Stack.Item grow style={{ height: '100%' }}>
                <Textarea value={inputContent} onChange={onChangeInput} className={styles.textArea} id={EXPLAINCODEEXTENSIONPANLEID} />
            </Stack.Item>
            <Stack.Item disableShrink>
                <Button
                    icon={<SearchRegular />}
                    onClick={() => {
                        askAIManager.askAiByMessage();
                    }}></Button>
            </Stack.Item>
            <Stack.Item disableShrink>
                <Button
                    icon={<DismissRegular />}
                    onClick={() => {
                        askAIManager.closeAiPanel();
                    }}
                ></Button>
            </Stack.Item>
        </Stack>
        <Stack.Item>
            {(answerContent && loadStatu === 'loaded') && <div className={styles.answerContent}>{answerContent}</div>}
            {loadStatu === 'loading' && <div className={styles.answerContent}>加载中...</div>}
            {(loadStatu === 'ready' && errorMessage) && <div className={styles.answerContent}>{errorMessage}</div>}
        </Stack.Item>
    </Stack>;
}
export default AskAIPanel;
