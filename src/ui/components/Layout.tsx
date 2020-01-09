import React, { ReactText } from "react";
import Drawer from '@material-ui/core/Drawer';
import "./Layout.css";

export interface LayoutProps {
    // Expect three child nodes, [current scope, scope tree, current signals, main panel content]
    children: [React.ReactNode, React.ReactNode, React.ReactNode, React.ReactNode];
    drawerWidth: ReactText;
}

const menuStyles = {
    backgroundColor: '#f5f5f5',
    top: 0,
    left: 0,
};

export const Layout: React.FC<LayoutProps> = (props: LayoutProps) => {
    return (
        <div>
            <Drawer
                variant="permanent"
                anchor="left"
                PaperProps={{ style: { width: props.drawerWidth } }}
            >
                <div>{props.children[0]}</div>
                <div style={menuStyles}>{props.children[1]}</div>
            </Drawer>
            <div className="outerContainer" style={{ paddingLeft: props.drawerWidth }}>
                <div className="signalsPanel">{props.children[2]}</div>
                <div className="wavePanel">{props.children[3]}</div>
            </div>
        </div >
    );
};
