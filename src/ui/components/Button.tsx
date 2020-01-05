import React from 'react';

export interface ButtonProps {
    icon?: string
}

export const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
    return (
        <div className="button">
            <p> test </p>
        </div >
    );
}