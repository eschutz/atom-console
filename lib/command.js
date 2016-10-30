'use babel';

// Command helpers are located within ./command
// Put custom commands and tools in the ./cmd directory
import fs from 'fs';
import CustomCommands from './command/command-imports';
import CustomTools from './command/tool-imports';

Object.values = obj => Object.keys(obj).map(key => obj[key]) || Object.values;

// This code would not work without a-laughlin's comment
// in Atom's Github Issues section: https://github.com/atom/atom/issues/5564

// Handles all command input – Atom commands, custom commands, aliases, tools (aliased)

export default class CommandHandler {

    // Gets all the built in and custom commands and assigns them to class constants
    constructor() {
        this.constants = {
            CMD_A: 1,
            CMD_C: 2,
            CMD_C_I: 3,
            CMD_A_ALIAS: 4,
            CMD_C_ALIAS: 5
        };
        this.COMMANDS = Object.keys(atom.commands.registeredCommands);
        customCommands = new CustomCommands();
        this.CUSTOM_COMMANDS = customCommands.CUSTOM_COMMANDS;
        customTools = new CustomTools();
        this.CUSTOM_TOOLS = customTools.CUSTOM_TOOLS;

        this.ALIASES = require('./command/aliases'); // JSON array of aliases
        this.globalHistFile = () => `${process.env.ATOM_HOME}/packages/atom-console/lib/history.json`; // Class constant as a function
        this.histFile = this.globalHistFile();
        this.history;
        this.setHistory = () => { try { this.history = require(this.histFile); } catch (err) { this.history = []; } }; // JSON array of commands executed
        this.setHistory();
        this.writeHistory = () => fs.writeFile(this.histFile, JSON.stringify(this.history), (err) => { if (err) console.log(err) });
    }

    // Where the magic happens
    executeConsoleCommand(command) {
        // The command variable is a string that the user enters from the console

        let returnValue;

        this.history.unshift(command); // Adds command to history

        let _this = this;
        // Executes Atom built in command (e.g. tree-view:toggle)
        let executeAtomCommand = cmd => {
            try {
                if (atom.commands.dispatch(atom.views.getView(atom.workspace.getActivePane().getActiveEditor()), cmd)) {
                    return true;
                } else {
                    return false;
                }
            } catch (err) {
                if (err.toString().includes('nodeName')) {
                    return "Select an editable text buffer!";
                }
            }
        }

        // Executes an in-console 'tool' that requires user input
        let startTool = tool => {
            currentTool = new tool();
            if (currentTool.prefix) {
                document.querySelector('div.console-prefix').textContent = currentTool.prefix;
            }
            _this.resetTool = false;
            if (currentTool.historyFile) {
                _this.histFile = currentTool.historyFile;
                _this.setHistory();
            }
            return currentTool;
        }

        // Output variable - this is an array so that there can be meaningful output
        // when a command is executed, or return false when the array's length is 0
        // See the bottom of the function for more info
        let commandLog = [];

        // Checks if tool is running and passes the input to the tool
        if (this.toolIsRunning) {
            let output = this.currentTool[this.currentTool.method](command);
            if (this.currentTool.specialOutput) {
                this.specialOutput = output;
                returnValue = this.specialOutput;
            } else {
                returnValue = '';
            }
            return returnValue;
        }

        // Alias handler (If the command string is an alias for another command)
        // ** All aliases should be added to aliases.json, and atom-console **
        // ** will automatically load the aliased command **

        if (Object.keys(this.ALIASES).includes(command)) {

            const aliasedName = this.ALIASES[command];
            const aliasedToolFunction = this.CUSTOM_TOOLS[aliasedName];
            const aliasedCommandFunction = this.CUSTOM_COMMANDS[aliasedName];

            // Aliased command handler
            if (this.COMMANDS.includes(aliasedName)) {
                returnValue = executeAtomCommand(aliasedName);

                // Output code
                commandLog.push(this.constants.CMD_A_ALIAS);
            } else if (Object.keys(this.CUSTOM_TOOLS).includes(aliasedName)) {
                // I would recommend all tool names are aliases for consistency
                // – currently atom-console only executes tools if they are aliased, although this may change in future
                // Using a name convention is also recommended: e.g. the tool (class)
                // FooBar would be invoked by the command 'foo-bar' or similar

                // Starts the interactive tool
                this.toolIsRunning = true;
                this.currentTool = startTool(aliasedToolFunction);
                returnValue = this.currentTool;
                return returnValue;
            } else if (Object.keys(this.CUSTOM_COMMANDS).includes(aliasedName)) {

                // Executes the custom command from alias
                returnValue = aliasedCommandFunction();
                commandLog.push(this.constants.CMD_C_ALIAS);
            }

            // Original command handler
        } else if (this.COMMANDS.includes(command)) {
            let atomCmd = executeAtomCommand(command);
            if (atomCmd) {
                returnValue = atomCmd;
                commandLog.push(this.constants.CMD_A);
            }
        } else if (Object.keys(this.CUSTOM_COMMANDS).includes(command)) {
            let cmdOutput = this.CUSTOM_COMMANDS[command];
            if (cmdOutput) {
                returnValue = cmdOutput;
                commandLog.push(this.constants.CMD_C);
            }
        } else {
            Object.values(this.CUSTOM_COMMANDS).forEach(c => {
                cCmd = c(command);
                if (cCmd) {
                    returnValue = cCmd;
                    commandLog.push(this.constants.CMD_C_I);
                }
            });

        }

        this.commandLog = commandLog;

        // Returns command output, or the command log if there was no command output;
        if (typeof returnValue != 'undefined') {
            return returnValue;
        } else {
            return commandLog;
        }
    }

    stopTool() {
        this.writeHistory();
        this.currentTool = null;
        this.toolIsRunning = false;
        this.specialOutput = null;
        this.histFile = this.globalHistFile();
        this.setHistory();
        document.querySelector('div.console-prefix').textContent = 'atom-console: ';
    }

    destroy() {
        this.writeHistory();
    }
}
