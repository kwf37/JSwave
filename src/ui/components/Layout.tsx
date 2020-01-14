import React, { ReactText } from "react";
import Drawer from "@material-ui/core/Drawer";
import "./Layout.css";
import { SplitPane } from "./SplitPane";

export interface LayoutProps {
    // Expect four child nodes, [current scope, scope tree, current signals, main panel content]
    children: [
        React.ReactNode,
        React.ReactNode,
        React.ReactNode,
        React.ReactNode
    ];
}

const menuStyles = {
    backgroundColor: "#f5f5f5",
    top: 0,
    left: 0,
};

export const Layout: React.FC<LayoutProps> = (props: LayoutProps) => {
    return (
        <div>
            <SplitPane>
                <div>
                    <div>{props.children[0]}</div>
                    <div style={menuStyles}>{props.children[1]}</div>
                </div>
                <div
                    className="outerContainer"
                >
                    <div className="signalsPanel">{props.children[2]}</div>
                    <div className="wavePanel">{props.children[3]}</div>
                </div>
            </SplitPane>
        </div>
    );
};
