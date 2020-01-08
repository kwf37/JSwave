import React from "react";
import Grid from '@material-ui/core/Grid';
import SplitPane from 'react-split-pane';
import "./Layout.css";

export interface LayoutProps {
    // Expect three child nodes, [header, sidepanel content, main panel content]
    children: [React.ReactNode, React.ReactNode, React.ReactNode];
}

const menuStyles = {
    backgroundColor: '#f5f5f5',
    top: 0,
    left: 0,
};

export const Layout: React.FC<LayoutProps> = (props: LayoutProps) => {
    return (
        <div>
            <Grid item xs={12}>
                <div>{props.children[0]}</div>
            </Grid>
            <SplitPane split="vertical" allowResize={true} defaultSize={'30%'} minSize={'100px'} primary="first">
                <div style={menuStyles}>{props.children[1]}</div>
                <div>{props.children[2]}</div>
            </SplitPane>
        </div>
    );
};

