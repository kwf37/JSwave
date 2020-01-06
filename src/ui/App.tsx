import React, { useState } from "react";
import * as ReactDOM from "react-dom";
import "./App.css";
import { Toolbar } from "./components/Toolbar";
import { WavePanel } from "./components/WavePanel";
import { ScopeTree } from "./components/ScopeTree";
import { Layout } from "./components/Layout";
import { VCD, Scope } from "../vcd_utils/ast";
import CurrentScope from "./components/CurrentScope";

// Extend global window type based off src/preload.js
declare global {
    interface Window {
        sendSyncMessage: any;
        registerVCDCallback: (f: (event: any, arg: any) => void) => void;
    }
}

const App: React.FC<{}> = () => {
    const [vcd, setVCD] = useState<VCD | null>(null);
    const [currScope, setCurrScope] = useState<Scope | null>(null);

    // Listen for messages from main process
    const callback = (_: any, arg: any) => {
        if (arg.status) {
            // Parsed Successfully!
            setVCD(arg.value);
            console.log("After setVCD");
            console.log(vcd);
        } else {
            console.log("File did not parse correctly:");
        }
    };
    window.registerVCDCallback(callback);

    // Pass current scope setter to child processes
    const setScope = (s: Scope | null): void => {
        setCurrScope(s);
    };

    return (
        <Layout>
            <Toolbar />
            <ScopeTree scope={vcd && vcd.toplevel} setCurrScope={setScope} />
            <CurrentScope scope={currScope}></CurrentScope>
        </Layout>
    );
};

ReactDOM.render(<App />, document.getElementById("root"));
