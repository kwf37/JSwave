import React from 'react';
import './Layout.css';

import { Toolbar } from './Toolbar';
import { WavePanel } from './WavePanel';
import { Menu } from './Menu';

export interface LayoutProps {

}

export const Layout: React.FC<LayoutProps> = (props: LayoutProps) => {
    return (
        <div className="outerContainer">
            <div className="topRow">
                <Toolbar />
            </div>

            <div className="bottomRow">
                <div className="leftColumn">
                    <Menu />
                </div>
                <div className="rightColumn">
                    <WavePanel />
                </div>
            </div>
        </div>
    );
}
