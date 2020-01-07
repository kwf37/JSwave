import { app, dialog, BrowserWindow, Menu, MenuItem } from "electron";
import * as fs from "fs";
import * as path from "path";
import VCDParser from "./vcd_utils/parser";

declare const MAIN_WINDOW_WEBPACK_ENTRY: any;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
    // eslint-disable-line global-require
    app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: Electron.BrowserWindow;

const createWindow = () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        webPreferences: {
            preload: path.join(app.getAppPath(), "src", "preload.js"),
        },
        height: 600,
        width: 800,
    });

    // Menu Additions

    // File Loading
    function readFile(filename: string) {
        let file = fs.readFileSync(filename, "utf-8");
        return file;
    }
    const openFileItem = new MenuItem({
        label: "Open File",
        click: () => {
            dialog
                .showOpenDialog({
                    properties: ["openFile"],
                    filters: [
                        { name: "Value Change Dump", extensions: ["vcd"] },
                    ],
                })
                .then(
                    filepath => {
                        console.log("Success!");
                        let file = readFile(filepath.filePaths[0]);
                        let parsed = VCDParser.vcd.parse(file);
                        mainWindow.webContents.send("vcd-file", parsed);
                    },
                    error => {
                        console.log("Error!");
                        console.log(error);
                    }
                );
        },
    });

    // Add to the file submenu- currently just a hack until we finish our own menu
    // I found the index by logging the getApllicationMenu object and inspecting items

    // Changed it to a loop since the order is diff for mac
    for (var i = 0; i < Menu.getApplicationMenu().items.length; i++) {
        if (Menu.getApplicationMenu().items[i].label === 'File') {
            const fileSubMenu = Menu.getApplicationMenu().items[i];
            fileSubMenu.submenu.insert(0, openFileItem);
            break;
        }
    }

    // and load the index.html of the app.
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on("closed", () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });

    // Manually set application menu at the end to work for mac
    Menu.setApplicationMenu(Menu.getApplicationMenu());
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});
