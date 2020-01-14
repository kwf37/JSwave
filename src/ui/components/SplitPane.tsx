import React, { ReactText, useState, SyntheticEvent } from "react";
import { makeStyles } from "@material-ui/core/styles";

interface SplitPaneProps {
    //direction: "vertical" | "horizontal";
    children: [React.ReactNode, React.ReactNode];
}

const useStyles = makeStyles({
    outer: {
        display: "flex",
    },
    separator: {
        width: "4px",
        height: "100%",
        cursor: 'ew-resize',
        display: "inline-block",
        position: 'absolute' as 'absolute',
        top: 0,
        bottom: 0,
        zIndex: 100,
        backgroundColor: '#f4f7f9'
    },
    div1: {
        flexShrink: 0,
        height: "100%",

    },
    div2: {
        height: "100%",
        flexGrow: 1,
    },
});

export const SplitPane: React.FC<SplitPaneProps> = props => {
    const classes = useStyles(props);
    const [width, setWidth] = useState(200);
    const [lastWidth, setLastWidth] = useState(width);
    const [isResizing, setIsResizing] = useState(false);
    const [lastX, setLastX] = useState(0);

    const handleMousedown = (e: SyntheticEvent<HTMLDivElement, MouseEvent>) => {
        setIsResizing(true);
        setLastX(e.nativeEvent.clientX);
        //console.log(e.nativeEvent.clientX);
    };

    const handleMousemove = (e: SyntheticEvent<HTMLDivElement, MouseEvent>) => {
        // we don't want to do anything if we aren't resizing.
        if (!isResizing) {
            return;
        }

        const deltaX = e.nativeEvent.clientX - lastX;

        let minWidth = 150;
        let maxWidth = 266;
        if (lastWidth + deltaX > minWidth && lastWidth + deltaX < maxWidth) {
            //console.log(lastWidth);
            setWidth(lastWidth + deltaX);
        }
    };

    const handleMouseup = (e: SyntheticEvent<HTMLDivElement, MouseEvent>) => {
        setLastWidth(width);
        setIsResizing(false)
    };

    return (
        <div className={classes.outer}
            onMouseMove={handleMousemove}
            onMouseUp={handleMouseup}
        >
            <div className={classes.div1} style={{ width: width + 'px' }}>
                {props.children[0]}
            </div>
            <div
                className={classes.separator}
                style={{ marginLeft: width }}
                onMouseDown={handleMousedown}
            ></div>
            <div className={classes.div2}>{props.children[1]}</div>
        </div>
    );
};
