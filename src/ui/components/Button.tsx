import React from 'react';
import './Button.css';

export interface ButtonProps {
    icon: string
}

export const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
    return (
        <div className="button">
            <img className="icon" src={props.icon}></img>
        </div >
    );
}