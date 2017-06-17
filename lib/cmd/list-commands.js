'use babel';

import fs from 'fs';

function bufferForURI(uri) {
	let buffer;
	atom.workspace.paneForURI(uri).getItems().forEach(item => {
		if (item.constructor.name === "TextEditor" && item.getPath() === uri) {
			buffer = item;
		}
	});
	return buffer;
}

// Tool that lists all commands
export default function listCommands() {
	let mdPath = `${process.env['ATOM_HOME']}/packages/atom-console/lib/tmp/Atom-Console Commands.md`;
	atom.workspace.open(mdPath).then(() => {
		const editor = atom.workspace.getActiveTextEditor();
		const _$ = t => editor.insertText(t + '\n\n');
		const commands = Object.keys(atom.commands.registeredCommands);
		const consoleCommands = require('../command/aliases.json');
		const consoleAliases = Object.keys(consoleCommands);
		editor.setText('');
		_$('# Atom Console Help');
		_$('## Atom-Console Commands');
		_$(`These commands are commands that come with Atom-Console and are located in \`~/.atom/packages/atom-console/lib/cmd\`.
Atom is extendable via these commands, see \`commands.md\` for more information.`);
		_$('Key: *atom-console command name* : *executed JavaScript function*');
		for (let cmd in consoleAliases) {
			if (consoleAliases.hasOwnProperty(cmd)) {
				_$(`* __${consoleAliases[cmd]}__ : *${consoleCommands[consoleAliases[cmd]]}*\n\n`)
			}
		}
		_$(`*Atom Console is an extension for Atom that allows the execution of commands via a small panel at the bottom of the window, inspired by the Emacs text-editor's 'M-x' feature.
This document contains a list of all the built-in Atom commands as well as the custom commands that come with Atom-Console*\n\n`);
		_$('## Built-in Atom Commands')
		_$(`These commands come with atom and are created within packages.
They can be manually executed in the developer console with \`atom.commands.dispatch(view, command)\`, or by name in \`atom-console\`.`);
		for (let cmd in commands) {
			if (commands.hasOwnProperty(cmd)) {
				_$(`* __${commands[cmd]}__`);
			}
		}

		let mdOpen = new Promise((resolve, reject) => {
			if (atom.commands.dispatch(atom.views.getView(atom.workspace.getActiveTextEditor()), "markdown-preview:toggle") === true) {
				resolve();
			} else {
				reject();
			}
		});

		mdOpen.then(() => {
			editor.getBuffer().save();
			bufferForURI(mdPath).destroy();
		});
		return true;
	}, () => {
		console.log('Atom-Console Commands.md buffer failed to open.');
		return false;
	});

	return true;
}
