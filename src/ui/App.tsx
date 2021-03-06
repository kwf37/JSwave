import React, { useState } from "react";
import * as ReactDOM from "react-dom";
import "./App.css";
import { CurrentSignals } from "./components/CurrentSignals";
import { WavePanel } from "./components/WavePanel";
import { ScopeTree } from "./components/ScopeTree";
import { Layout } from "./components/Layout";
import { VCD, Scope, Variable } from "../vcd_utils/ast";
import CurrentScope from "./components/CurrentScope";

// Extend global window type based off src/preload.js
declare global {
    interface Window {
        sendSyncMessage: any;
        registerVCDCallback: (f: (event: any, arg: any) => void) => void;
    }
}

let list_key = 0;

const App: React.FC<{}> = () => {
    const [vcd, setVCD] = useState<VCD | null>(null);
    const [currScope, setCurrScope] = useState<Scope | null>(null);
    const [displayVars, setDisplayVars] = useState<Variable[]>([]);

    // Listen for messages from main process
    const callback = (_: any, arg: any) => {
        if (arg.status) {
            // Parsed Successfully!
            setVCD(arg.value);
        } else {
            console.log("File did not parse correctly:");
        }
    };
    window.registerVCDCallback(callback);

    // Pass current scope setter to child processes
    const setScope = (s: Scope | null): void => {
        setCurrScope(s);
    };

    // Add variables to be displayed on waveform
    const addVar = (v: Variable): void => {
        v.key = list_key;
        setDisplayVars([...displayVars, v]);
        list_key += 1;
    };

    const setVars = (vars: Variable[]): void => {
        var newArray = vars.slice();
        setDisplayVars(newArray);
    }

    return (
        <Layout>
            <CurrentScope scope={currScope} addVar={addVar}></CurrentScope>
            <ScopeTree scope={vcd && vcd.toplevel} setCurrScope={setScope} />
            <CurrentSignals variables={displayVars} setVars={setVars} fontSize={14} />
            <WavePanel
                timescale={vcd && vcd.timescale}
                changes={vcd && vcd.changes}
                variables={displayVars}
            ></WavePanel>
        </Layout>
    );
};

ReactDOM.render(<App />, document.getElementById("root"));
