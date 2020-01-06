import React from "react";
import { Scope } from "../../vcd_utils/ast";

interface ScopeTreeProps {
    scope: Scope;
}

export const ScopeTree: React.FC<ScopeTreeProps> = props => {
    return (
        <ul>
            {props.scope.get_subscopes().map(subscope => {
                <li>
                    <ScopeTree scope={subscope}></ScopeTree>
                </li>;
            })}
        </ul>
    );
};
