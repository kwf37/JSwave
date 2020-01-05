import React from 'react';

export interface WavePanelProps {
    icon?: string
}

export const WavePanel: React.FC<WavePanelProps> = (props: WavePanelProps) => {
    return (
        <div className="button">
            <p> test </p>
        </div >
    );
}