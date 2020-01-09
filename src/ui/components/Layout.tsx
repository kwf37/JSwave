import React from "react";
import Drawer from '@material-ui/core/Drawer';
import "./Layout.css";

export interface LayoutProps {
    // Expect three child nodes, [current scope, scope tree, current signals, main panel content]
    children: [React.ReactNode, React.ReactNode, React.ReactNode, React.ReactNode];
}

const drawerWidth = '200px';

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
            >
                <div>{props.children[0]}</div>
                <div style={menuStyles}>{props.children[1]}</div>
            </Drawer>
            <div style={{ paddingLeft: drawerWidth }}>{props.children[2]}</div>
            <div style={{ paddingLeft: drawerWidth }}>{props.children[3]}</div>
        </div>
    );
};
