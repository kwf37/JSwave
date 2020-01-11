import React, { ReactText, useState, SyntheticEvent } from "react";
import { makeStyles } from "@material-ui/core/styles";

interface SplitPaneProps {
    //direction: "vertical" | "horizontal";
    children: [React.ReactNode, React.ReactNode];
}

const useStyles = makeStyles({
    outer: {
        height: "100%",
        width: "100%",
        display: "inline-block",
        //flexDirection: "row",
    },
    seperator: {
        width: "10px",
        height: "100px",
        cursor: 'ew-resize',
        display: "inline-block",
    },
    div1: {
        height: "100%",
        display: "inline-block",

    },
    //flexGrow: 1 },
    div2: {
        height: "100%",
        width: "auto",
        display: "inline-block",
    },
    //flexGrow: 3 },
});

export const SplitPane: React.FC<SplitPaneProps> = props => {
    const classes = useStyles(props);
    const [width, setWidth] = useState(500);
    const [lastWidth, setLastWidth] = useState(width);
    const [dividerColor, setDividerColor] = useState("red");
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
        //console.log(deltaX);
        let minWidth = 50;
        let maxWidth = 600;
        //if (lastWidth + deltaX > minWidth && lastWidth + deltaX < maxWidth) {
        console.log(lastWidth);
        setWidth(lastWidth + deltaX);
        //}
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
                className={classes.seperator}
                style={{ backgroundColor: dividerColor }}
                onMouseDown={handleMousedown}
            ></div>
            <div className={classes.div2}>{props.children[1]}</div>
        </div>
    );
};
