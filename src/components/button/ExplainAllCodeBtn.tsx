import { EXPLAINCODEBTNID } from "../../common/contants";
import { createUseStyles } from 'react-jss';
import React from 'react';
import { useExplainCodeContext } from "../../context/explainCode/contextManager";
import { useObservableValue } from "../../context/rxjsHelper";
import { Button, Popover, PopoverSurface, PopoverTrigger } from "@fluentui/react-components";

// 定义样式
const useStyles = createUseStyles({
    button: {
        position: 'fixed',
        right: '0px',
        bottom: '25%',
        zIndex: '1000',
        backgroundColor: '#4CAF50',
        padding: '10px',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        fontSize: '12px',
        lineHeight: '14px',
        borderTopLeftRadius: '20px',  /* 左上圆角 */
        borderBottomLeftRadius: '20px', /* 左下圆角 */
        '&:hover': {
            backgroundColor: 'lightgray',
            border: '1px black soild',
        },
    },
    popover: {
        backgroundColor: 'white',
        color: 'black',
        padding: '10px',
        border: '1px solid lightgray',
        borderRadius: 5,
    }
});

export const ExplainAllCodeBtn: React.FC = () => {
    const styles = useStyles();
    const { explainCodeManager } = useExplainCodeContext();
    const [open, setOpen] = React.useState<boolean>(false);
    const enableLoad = useObservableValue(explainCodeManager.enableLoad$, () => explainCodeManager.enableLoad);
    const popoverMessage = useObservableValue(explainCodeManager.popoverMessage$, () => explainCodeManager.popoverMessage);
    const buttonText = React.useMemo(() => {
        switch (enableLoad) {
            case true: return '移除解释';
            case false: return '解释代码';
        }
    }, [enableLoad]);

    const onClick = React.useCallback(() => {
        explainCodeManager.triggerExpalinCode();
    }, [explainCodeManager]);

    React.useEffect(() => {
        if (popoverMessage && popoverMessage.length) {
            console.log('popoverMessage');
            setOpen(true);
        }
    }, [popoverMessage]);

    return <Popover
        withArrow open={open}
        onOpenChange={(e, data) => {
            if (data.open) {
                setTimeout(() => setOpen(false), 3000);
            }
        }}>
        <PopoverTrigger><Button
            id={EXPLAINCODEBTNID}
            onClick={onClick}
            className={styles.button}
        >{buttonText}</Button></PopoverTrigger>
        <PopoverSurface className={styles.popover}>
            {popoverMessage}
        </PopoverSurface>

    </Popover>;
}

export default ExplainAllCodeBtn;