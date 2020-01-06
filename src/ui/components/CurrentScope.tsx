import React from "react";
import { Scope, refString } from "../../vcd_utils/ast";

import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

interface CurrScopeProps {
    scope: Scope | null;
}

const CurrentScope: React.FC<CurrScopeProps> = props => {
    return (
        <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                    Current Scope Variables
                </ListSubheader>
            }
        >
            {props.scope &&
                props.scope.variables.map(v => {
                    return (
                        <ListItem button>
                            <ListItemText
                                primary={`${v.type} ${refString(v.ref)}`}
                            />
                        </ListItem>
                    );
                })}
        </List>
    );
};

export default CurrentScope;
