import React from "react";
import Grid from '@material-ui/core/Grid';
import "./Layout.css";

export interface LayoutProps {
    // Expect three child nodes, [header, sidepanel content, main panel content]
    children: [React.ReactNode, React.ReactNode, React.ReactNode];
}

export const Layout: React.FC<LayoutProps> = (props: LayoutProps) => {
    return (
        <Grid container>
            <Grid item xs={12}>
                <div>{props.children[0]}</div>
            </Grid>
            <Grid item xs={4} style={{ minWidth: '250px' }}>
                <div>{props.children[1]}</div>
            </Grid>
            <Grid item xs={8}>
                <div>{props.children[2]}</div>
            </Grid>
        </Grid>
    );
};
