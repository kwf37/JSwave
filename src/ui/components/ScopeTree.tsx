import React from "react";
import { Scope } from "../../vcd_utils/ast";

import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

interface ScopeTreeProps {
    scope: Scope | null;
    setCurrScope: (s: Scope | null) => void;
}

const ScopeLevel: React.FC<ScopeTreeProps> = props => {
    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
        setOpen(!open);
        props.setCurrScope(props.scope);
    };
    return (
        <>
            <ListItem button onClick={handleClick}>
                <ListItemText primary={props.scope && props.scope.identifier} />
                {props.scope &&
                    props.scope.sub_scopes.length > 0 &&
                    (open ? <ExpandLess /> : <ExpandMore />)}
            </ListItem>
            {props.scope && props.scope.sub_scopes.length > 0 && (
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {props.scope.sub_scopes.map(subscope => {
                            return (
                                <ScopeLevel
                                    scope={subscope}
                                    setCurrScope={props.setCurrScope}
                                ></ScopeLevel>
                            );
                        })}
                    </List>
                </Collapse>
            )}
        </>
    );
};

export const ScopeTree: React.FC<ScopeTreeProps> = props => {
    const [open, setOpen] = React.useState(true);

    const handleClick = () => {
        setOpen(!open);
    };
    return (
        <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                    Scope Hierarchy
                </ListSubheader>
            }
        >
            {props.scope && (
                <ScopeLevel
                    scope={props.scope}
                    setCurrScope={props.setCurrScope}
                ></ScopeLevel>
            )}
        </List>
    );
};
