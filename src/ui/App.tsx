import React, { useState } from "react";
import * as ReactDOM from "react-dom";
import "./App.css";
import { Toolbar } from "./components/Toolbar";
import { WavePanel } from "./components/WavePanel";
import { ScopeTree } from "./components/ScopeTree";
import { Layout } from "./components/Layout";
import { VCD } from "../vcd_utils/ast";

// Extend global window type based off src/preload.js
declare global {
    interface Window {
        sendSyncMessage: any;
        registerVCDCallback: (f: (event: any, arg: any) => void) => void;
    }
}

const App: React.FC<{}> = () => {
    const [vcd, setVCD] = useState<VCD | null>(null);
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
    return (
        <Layout>
            <Toolbar />
            <ScopeTree scope={vcd && vcd.toplevel} />
            <WavePanel />
        </Layout>
    );
};

ReactDOM.render(<App />, document.getElementById("root"));
