import React from "react";
import { refString, Variable } from "../../vcd_utils/ast";
import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { ListItemSecondaryAction, ListItemIcon, Typography } from "@material-ui/core";
import DragHandleIcon from "@material-ui/icons/DragHandle";
import { Container, Draggable } from "react-smooth-dnd";
import { makeStyles } from '@material-ui/core/styles';

interface CurrentSignalsProps {
    variables: Variable[];
    fontSize: number;
    setVars: (vars: Variable[]) => void;
};

const useStyles = makeStyles({
    root: {
        minWidth: '0px',
    }
});

function array_move(arr: any[], old_index: any, new_index: any) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr;
};

interface onDropArgs {
    removedIndex: number,
    addedIndex: number
}


export const CurrentSignals: React.FC<CurrentSignalsProps> = (props: CurrentSignalsProps) => {
    const classes = useStyles({});
    const onDrop = ({ removedIndex, addedIndex }: onDropArgs) => {
        props.setVars(array_move(props.variables, removedIndex, addedIndex));
    };

    return (
        <List
            subheader={
                <ListSubheader disableSticky component="div">
                    Signals
                </ListSubheader>
            }
        >
            <Container dragHandleSelector=".drag-handle" lockAxis="y" onDrop={onDrop}>
                {props.variables.map(v => {
                    return (
                        <Draggable key={v.key}>
                            <ListItem>
                                <ListItemText
                                    primary={
                                        <Typography style={{ fontSize: props.fontSize }}>
                                            {refString(v.ref)}
                                        </Typography>
                                    }
                                />
                                <ListItemSecondaryAction>
                                    <ListItemIcon className="drag-handle" classes={{ root: classes.root }}>
                                        <DragHandleIcon />
                                    </ListItemIcon>
                                </ListItemSecondaryAction>
                            </ListItem>
                        </Draggable>
                    );
                })}
            </Container>
        </List>
    );
};
