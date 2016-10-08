'use babel';

import CustomCommands from './command-imports';

// This code would not work without a-laughlin's comment
// in Atom's Github Issues section: https://github.com/atom/atom/issues/5564

export default class CommandHandler {
    COMMANDS: null;
    CUSTOM_COMMANDS: null;
    ALIASES: null;

    constructor() {
        this.COMMANDS = Object.keys(atom.commands.registeredCommands);

        customCommands = new CustomCommands();
        this.CUSTOM_COMMANDS = customCommands.CUSTOM_COMMANDS;

        this.ALIASES = require('./aliases');
    }

    executeConsoleCommand(command) {
        function executeAtomCommand(cmd) {
            return atom.commands.dispatch(atom.views.getView(atom.workspace.getActivePane().getActiveEditor()), cmd);
        }

        let successes = [];

        if (Object.keys(this.ALIASES).includes(command)) {
            if (this.COMMANDS.includes(command)) {
                executeAtomCommand(command);
                successes.push("executed Atom command from alias");
            } else {
                // Executes the custom command from alias
                this.CUSTOM_COMMANDS[this.CUSTOM_COMMANDS.indexOf(this.ALIASES[command])]();
                successes.push("executed custom command from alias");
            }
        } else if (this.COMMANDS.includes(command)) {
            if (executeAtomCommand(command)) {
                successes.push("executed Atom command");
            }
        } else if (this.CUSTOM_COMMANDS.includes(command)) {
            cmd = this.CUSTOM_COMMANDS[this.CUSTOM_COMMANDS.indexOf(command)];
            if (cmd()) {
                successes.push("executed custom command");
            }
        } else {
            this.CUSTOM_COMMANDS.forEach(function(c) {
                if (c(command)) {
                    successes.push("executed custom command with input as argument");
                }
            });

        }
        if (successes.length == 0) {
            return false;
        } else {
            return true;
        }
    }
}
