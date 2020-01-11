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
        display: "flex",
        flexDirection: "row",
    },
    seperator: {
        width: "10px",
        height: "100px",
    },

    div1: { height: "100%", flexGrow: 1 },

    div2: { height: "100%", flexGrow: 3 },
});

export const SplitPane: React.FC<SplitPaneProps> = props => {
    const classes = useStyles(props);
    const [splitPos, setSplitPos] = useState("50%");
    const [dividerColor, setDividerColor] = useState("red");
    function onDrag(event: SyntheticEvent) {
        console.log(event);
        //    setSplitPos(event.)
    }
    function onEnter(event: SyntheticEvent) {
        setDividerColor("green");
    }
    function onExit(event: SyntheticEvent) {
        setDividerColor("red");
    }
    return (
        <div className={classes.outer}>
            <div className={classes.div1} style={{ width: splitPos }}>
                {props.children[0]}
            </div>
            <div
                className={classes.seperator}
                style={{ backgroundColor: dividerColor }}
                onMouseDown={onDrag}
                onMouseEnter={onEnter}
                onMouseOut={onExit}
            ></div>
            <div className={classes.div2}>{props.children[1]}</div>
        </div>
    );
};
