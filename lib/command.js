'use babel';

import CustomCommands from './command-imports';
import CustomTools from './tool-imports';

Object.values = obj => Object.keys(obj).map(key => obj[key]) || Object.values;

// This code would not work without a-laughlin's comment
// in Atom's Github Issues section: https://github.com/atom/atom/issues/5564

// This is where the primary functionality of atom-console comes from

export default class CommandHandler {
    COMMANDS: null;
    CUSTOM_COMMANDS: null;
    CUSTOM_TOOLS: null;
    ALIASES: null;

    // Gets all the built in and custom commands and assigns them to class constants
    constructor() {
        this.COMMANDS = Object.keys(atom.commands.registeredCommands);

        customCommands = new CustomCommands();
        this.CUSTOM_COMMANDS = customCommands.CUSTOM_COMMANDS;
        customTools = new CustomTools();
        this.CUSTOM_TOOLS = customTools.CUSTOM_TOOLS;

        this.ALIASES = require('./aliases');
    }

    // Where the magic happens
    executeConsoleCommand(command) {
      // The command variable is a string that the user enters from the console

      // Executes Atom built in command (e.g. tree-view:toggle)
        function executeAtomCommand(cmd) {
            return atom.commands.dispatch(atom.views.getView(atom.workspace.getActivePane().getActiveEditor()), cmd);
        }

        // Executes an in-console 'tool' that requires user input
        function runTool(tool) {
            currentTool = new tool();
            if (currentTool.prefix) {
                document.querySelector('div.console-prefix').textContent = currentTool.prefix;
            }
            console.log("Tool is operational!");
        }

        // Output variable - this is an array so that there can be meaningful output
        // when a command is executed, or return false when the array's length is 0
        // See the bottom of the function for more info
        let successes = [];

        // Alias handler (If the command string is an alias for another command)
        // ** All aliases should be added to aliases.json, and atom-console **
        // ** will automatically load the aliased command **

        if (Object.keys(this.ALIASES).includes(command)) {

          const aliasedName = this.ALIASES[command];

          const aliasedToolFunction = this.CUSTOM_TOOLS[aliasedName];
          const aliasedCommandFunction = this.CUSTOM_COMMANDS[aliasedName];

          // Aliased command handler
            if (this.COMMANDS.includes(aliasedName)) {
                executeAtomCommand(command);

                // Adds a meaningful message about how the command executed to the output
                successes.push("executed Atom command from alias");
            } else if (Object.keys(this.CUSTOM_TOOLS).includes(aliasedName)) {
              // I would recommend all tool names are aliases for consistency
              // – currently atom-console only executes tools if they are aliased, although this may change in future
              // Using a name convention is also recommended: e.g. the tool (class)
              // FooBar would be invoked by the command 'foo-bar' or similar

                // Starts the interactive tool
                runTool(aliasedToolFunction);
            } else if (Object.keys(this.CUSTOM_COMMANDS).includes(aliasedName)){

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
}
