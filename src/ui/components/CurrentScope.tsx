import React from "react";
import { Scope, refString, Variable } from "../../vcd_utils/ast";

import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

interface CurrScopeProps {
    scope: Scope | null;
    addVar: (v: Variable) => void;
}

const CurrentScope: React.FC<CurrScopeProps> = props => {
    return (
        <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
                <ListSubheader disableSticky component="div" id="nested-list-subheader">
                    Current Scope Variables
                </ListSubheader>
            }
        >
            {props.scope &&
                props.scope.variables.map(v => {
                    return (
                        <ListItem button onDoubleClick={() => props.addVar(v)}>
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
