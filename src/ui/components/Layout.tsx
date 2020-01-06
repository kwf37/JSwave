import React from "react";
import "./Layout.css";

export interface LayoutProps {
    // Expect three child nodes, [header, sidepanel content, main panel content]
    children: [React.ReactNode, React.ReactNode, React.ReactNode];
}

export const Layout: React.FC<LayoutProps> = (props: LayoutProps) => {
    return (
        <div className="outerContainer">
            <div className="topRow">{props.children[0]}</div>

            <div className="bottomRow">
                <div className="leftColumn">{props.children[1]}</div>
                <div className="rightColumn">{props.children[2]}</div>
            </div>
        </div>
    );
};
