import React from "react";
import { Scope } from "../../vcd_utils/ast";

interface ScopeTreeProps {
    scope: Scope | null;
}

export const ScopeTree: React.FC<ScopeTreeProps> = props => {
    return (
        <ul>
            {props.scope && props.scope.identifier}
            {props.scope &&
                props.scope.sub_scopes.map(subscope => {
                    return (
                        <li>
                            <ScopeTree scope={subscope}></ScopeTree>
                        </li>
                    );
                })}
        </ul>
    );
};
