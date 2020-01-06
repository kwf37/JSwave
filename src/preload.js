// This file is used as a preload script by index.ts
// There is no electron support for Typescript preload
// preload files so we're leaving this as Javascript for now
const { ipcRenderer } = require("electron");

let callback = _ =>
    console.log(
        "preload.js: No callback set yet using window.registerVCDCallback"
    );

window.registerVCDCallback = f => {
    callback = f;
};

ipcRenderer.on("vcd-file", (event, arg) => {
    callback(event, arg);
});
