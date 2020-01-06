const fs = require("fs");
const path = require("path");

export function read() {
    let file = fs.readFileSync(
        path.resolve(__dirname, "./examples/test.vcd"),
        "utf-8"
    );
    return file;
}
