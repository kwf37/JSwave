# JSwave

A Javascript visualizer for Verilog Value Change Dump (VCD) files.

## Dev Notes

-   I got this weird error when trying to run electron on Ubuntu WSL https://askubuntu.com/questions/547151/error-while-loading-shared-libraries-libxss-so-1

    -   Also got this error right after: https://github.com/electron/electron/issues/17972

-   JSwave does not enforce that each .vcd file have a version, description, or scopes. For the most part we assume that the files are well-formatted

-   JSwave ignores all simulation keywords in the standard 4-value VCD file. This may be changed later, but we believe that the simulation keywords are redundant conventions and do not affect the functionality of JSwave

-   Comment handling and Simulation keywords are ignored in a hacky way- should be a nicer way to ignore them

-   As a first pass, we will mimic the layout and ui of GTKwave (http://gtkwave.sourceforge.net/)

-   Example VCD files are in the `examples/` directory and should be run using GTKwave to see sample output

-   ipcMain and ipcRenderer are convenient classes for implementing main process and renderer process communication.
