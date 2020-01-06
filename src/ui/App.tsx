import * as React from "react";
import * as ReactDOM from "react-dom";
import "./App.css";

import { Layout } from "./components/Layout";
import { VCD } from "../vcd_utils/ast";

interface AppState {
    vcd: VCD | null;
}
// Toplevel app state
let state: AppState = {
    vcd: null,
};

// Listen for new VCD file selections from electron filechooser dialog
function callback(_: any, arg: any) {
    if (arg.status) {
        // Parsed Successfully!
        const vcd = arg.value;
        state.vcd = vcd;
        console.log(state);
    } else {
        console.log("File did not parse correctly:");
    }
}
window.registerVCDCallback(callback);

ReactDOM.render(<Layout />, document.getElementById("root"));
