import React from 'react';
import { Button, ButtonProps } from './Button';

export interface ToolbarProps {
    buttons?: ButtonProps[]
}

const buttons = [
    { icon: 'https://cdn4.iconfinder.com/data/icons/files-and-folders-thinline-icons-set/144/File_Upload-512.png' }
];

// export class Toolbar {
//     render() {
//         buttons.map(button => {
//             return <Button icon={button.icon} />
//         });
//     }
// };

export const Toolbar: React.FC<ToolbarProps> = (props: ToolbarProps) => {
    return <Button icon={buttons[0].icon} />
}