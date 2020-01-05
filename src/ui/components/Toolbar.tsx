import React from 'react';
import { Button, ButtonProps } from './Button';

export interface ToolbarProps {
    buttons?: ButtonProps[]
}

export const Toolbar: React.FC<ToolbarProps> = (props: ToolbarProps) => {
    return (
        <div>
            <p> test </p>
        </div>
    );
}