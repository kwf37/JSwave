import React from "react";
import { refString, Variable } from "../../vcd_utils/ast";
import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { ListItemSecondaryAction, ListItemIcon } from "@material-ui/core";
import DragHandleIcon from "@material-ui/icons/DragHandle";
import { Container, Draggable } from "react-smooth-dnd";
import { makeStyles } from '@material-ui/core/styles';

interface CurrentSignalsProps {
    variables: Variable[];
};

const useStyles = makeStyles({
    root: {
        minWidth: '0px',
    }
});

// const onDrop = ({ removedIndex, addedIndex }) => {
//     setItems(items => arrayMove(items, removedIndex, addedIndex));
// };

export const CurrentSignals: React.FC<CurrentSignalsProps> = (props: CurrentSignalsProps) => {
    const classes = useStyles({});

    return (
        <List
            subheader={
                <ListSubheader disableSticky component="div">
                    Signals
                </ListSubheader>
            }
        >
            <Container dragHandleSelector=".drag-handle" lockAxis="y">  {/*onDrop={onDrop}> */}
                {props.variables.map(v => {
                    return (
                        <Draggable key={v.key}>
                            <ListItem>
                                <ListItemText
                                    primary={`${refString(v.ref)}`}
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
