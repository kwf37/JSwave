import React from "react";
import { refString, Variable } from "../../vcd_utils/ast";
import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

interface CurrentSignalsProps {
    variables: Variable[];
};

export const CurrentSignals: React.FC<CurrentSignalsProps> = (props: CurrentSignalsProps) => {
    return (
        <List
            subheader={
                <ListSubheader disableSticky component="div">
                    Signals
                </ListSubheader>
            }
        >
            {props.variables.map(v => {
                return (
                    <ListItem>
                        <ListItemText
                            primary={`${refString(v.ref)}`}
                        />
                    </ListItem>
                );
            })}
        </List>
    );
};
