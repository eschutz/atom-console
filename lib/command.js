'use babel';

// Command helpers are located within ./command
// Put custom commands and tools in the ./cmd directory
import fs from 'fs';
import CustomCommands from './command/command-imports';

Object.values = obj => Object.keys(obj).map(key => obj[key]) || Object.values;

// This code would not work without a-laughlin's comment
// in Atom's Github Issues section: https://github.com/atom/atom/issues/5564

// Handles all command input – Atom commands, custom commands, aliases, tools (aliased)

export default class CommandHandler {

	constructor() {
		this.COMMANDS = {};
		Object.keys(atom.commands.registeredCommands).forEach( cmd => {
			this.COMMANDS[cmd] = ["executeAtomCommand", cmd];
		});
		Object.assign(this.COMMANDS, new CustomCommands().CUSTOM_COMMANDS);

		this.ALIASES = require('./command/aliases'); // JSON object of aliases

		this.globalHistFile = () => `${process.env.ATOM_HOME}/packages/atom-console/lib/history.json`; // Class constant as a function
		this.histFile = this.globalHistFile();
		this.setHistory = () => { try { this.history = require(this.histFile); } catch (err) { this.history = []; } }; // JSON array of commands executed
		this.setHistory();
		this.writeHistory = () => fs.writeFile(this.histFile, JSON.stringify(this.history), (err) => { if (err) console.log(err) });

		this.toolIsRunning = false;
	}

	// Where the magic happens
	executeConsoleCommand(command) {

		let cmdData, returnValue;
		this.history.unshift(command); // Adds command to history

		// Checks if tool is running and passes the input to the tool
		if (this.toolIsRunning) {
			returnValue = this.currentTool.run(command);

			let currentPrefix = document.querySelector('div.console-prefix');
			if (this.currentTool.prefix && this.currentTool.prefix != currentPrefix) {
				currentPrefix.textContent = this.currentTool.prefix;
			}

			return returnValue ? returnValue : '';
		}


		if (this.ALIASES[command] != undefined) {
			let alias = this.ALIASES[command];
			if (alias.constructor.name == "Array") {
				cmdData = ["executeAtomCommands", alias];
			} else if (alias.constructor.name == "String"){
				cmdData = this.COMMANDS[alias];
			}
		} else {
			cmdData = getPropertyFromRegex(this.COMMANDS, command);
		}

		if (cmdData) {
			let f, fName = cmdData.constructor.name;

			// Execute the command function safely
			let execFunction = (func, args) => {
				if (func.constructor.name == "Function") {
					returnValue = func.call(this, args);
				} else {
					returnValue = "Error! Check console for further details.";
					console.error(`There was an error during command execution! Debug Information:\nCommand: ${command}\nCommand Data: ${cmdData}\nFunction Class: ${func.constructor.name}`);
				}
			}

			if (fName == "Array") {
				f = this[cmdData[0]];
				execFunction(f, cmdData[1]);
			} else if (fName == "Function") {
				f = cmdData;
				execFunction(f, command);
			}

		}

		return returnValue;
	}

	// Executes Atom built in command (e.g. tree-view:toggle)
	executeAtomCommand(cmd) {
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

	executeAtomCommands(cmdList) {
		let success, type = cmdList.constructor.name;
		if (type == "Array") {
			for (let cmd of cmdList) {
				success = this.executeAtomCommand(cmd);
				if (!success) break;
			}
		} else if (type == "String"){
			this.executeAtomCommand(cmdList);
		} else {
			success = "There was an issue with the execution of this command! Check the console for more details.";
			console.error(`Error in executeAtomCommands: argument given is neither an Array or String\nCommand List: ${cmdList}`);
		}
		return success;
	}

	// Executes an in-console 'tool' that requires user input
	startTool(tool) {
		this.currentTool = new tool();
		if (this.currentTool.prefix) {
			document.querySelector('div.console-prefix').textContent = this.currentTool.prefix;
		}
		this.resetTool = false;
		if (this.currentTool.historyFile) {
			this.histFile = this.currentTool.historyFile;
			this.setHistory();
		}
		this.toolIsRunning = true;
		return this.currentTool;
	}

	stopTool() {
		this.writeHistory();
		this.currentTool = null;
		this.toolIsRunning = false;
		this.histFile = this.globalHistFile();
		this.setHistory();
		document.querySelector('div.console-prefix').textContent = 'atom-console: ';
	}

	destroy() {
		this.writeHistory();
	}
}

// Extension of Object to enable getting arguments from a regexp
function getPropertyFromRegex(obj, arg) {

	for (let prop in obj) {
		let regexProp = RegExp.escape(prop);
		if (prop.startsWith('rx:')) regexProp = new RegExp(prop.replace('rx:', ''));
		if (obj.hasOwnProperty(prop) && arg.match(regexProp)) {
			return obj[prop];
		}
	}
};

RegExp.escape = function(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};
