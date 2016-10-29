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
        this.COMMANDS = Object.keys(atom.commands.registeredCommands);
        customCommands = new CustomCommands();
        this.CUSTOM_COMMANDS = customCommands.CUSTOM_COMMANDS;
        customTools = new CustomTools();
        this.CUSTOM_TOOLS = customTools.CUSTOM_TOOLS;

        this.ALIASES = require('./command/aliases'); // JSON array of aliases
        this.globalHistFile = () => `${process.env.ATOM_HOME}/packages/atom-console/lib/history.json`; // Class constant as a function
        this.histFile = this.globalHistFile();
        this.history;
        this.setHistory = () => {try {this.history = require(this.histFile);} catch(err) {this.history = [];}};  // JSON array of commands executed
        this.setHistory();
    }

    // Where the magic happens
    executeConsoleCommand(command) {
        // The command variable is a string that the user enters from the console

        this.history.unshift(command); // Adds command to history

        let _this = this;
        // Executes Atom built in command (e.g. tree-view:toggle)
        function executeAtomCommand(cmd) {
          try {
            return atom.commands.dispatch(atom.views.getView(atom.workspace.getActivePane().getActiveEditor()), cmd);
          } catch(err) {
            if (err.toString().includes('nodeName')) {
              return "Select an editable text buffer!";
            }
          }
        }

        // Executes an in-console 'tool' that requires user input
        function startTool(tool) {

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
        let successes = [];

        // Checks if tool is running and passes the input to the tool
        if (this.toolIsRunning) {
            this.specialOutput = this.currentTool[this.currentTool.method](command);
            return this.specialOutput;
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
                executeAtomCommand(aliasedName);

                // Adds a meaningful message about how the command executed to the output
                successes.push("executed Atom command from alias");
            } else if (Object.keys(this.CUSTOM_TOOLS).includes(aliasedName)) {
                // I would recommend all tool names are aliases for consistency
                // – currently atom-console only executes tools if they are aliased, although this may change in future
                // Using a name convention is also recommended: e.g. the tool (class)
                // FooBar would be invoked by the command 'foo-bar' or similar

                // Starts the interactive tool
                this.toolIsRunning = true;
                return this.currentTool = startTool(aliasedToolFunction);
            } else if (Object.keys(this.CUSTOM_COMMANDS).includes(aliasedName)) {

                // Executes the custom command from alias
                aliasedCommandFunction();
                successes.push("executed custom command from alias");
            }

            // Original command handler
        } else if (this.COMMANDS.includes(command)) {
            if (executeAtomCommand(command)) {
                successes.push("executed Atom command");
            }
        } else if (Object.keys(this.CUSTOM_COMMANDS).includes(command)) {
            if (this.CUSTOM_COMMANDS[command]) {
                successes.push("executed custom command");
            }
        } else {
            Object.values(this.CUSTOM_COMMANDS).forEach(function(c) {
                if (c(command)) {
                    successes.push("executed custom command with input as argument");
                }
            });

        }

        // Returns successes if there was meaningful output, or false if all commands failed
        if (successes.length == 0) {
            return false;
        } else {
            return successes;
        }
    }

    stopTool() {
        this.currentTool = null;
        this.toolIsRunning = false;
        this.specialOutput = null;
        this.histFile = this.globalHistFile();
        this.setHistory();
        document.querySelector('div.console-prefix').textContent = 'atom-console: ';
    }

    destroy() {
      fs.writeFile(this.histFile, JSON.stringify(this.history), (err) => {if (err) console.log(err)});
    }
}
