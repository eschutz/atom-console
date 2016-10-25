'use babel';

import fs from 'fs';

// Tool that lists all commands
export default function listCommands() {
  // Checks if arguments are given, if not, return false
  if (!(arguments.length == 0)) {
    return false;
  } else {
    return atom.workspace.open('Atom-Console Commands.md').then(function() {
        const editor = atom.workspace.getActiveTextEditor();
        const _$ = t => editor.insertText(t);
        const commands = Object.keys(atom.commands.registeredCommands);
        const consoleCommands = require('../command/aliases.json');
        const consoleAliases = Object.keys(consoleCommands);
        _$('# Atom Console Help\n\n');
        _$(`## Atom-Console Commands\n\n
These commands are commands that come with Atom-Console and are located in \`~/.atom/packages/atom-console/lib/cmd\`.
Atom is extendable via these commands, see \`commands.md\` for more information.\n\n
Key: *atom-console command name* : *executed JavaScript function*\n\n`);
        for (let cmd in consoleAliases) {
            if (consoleAliases.hasOwnProperty(cmd)) {
                _$(`* __${consoleAliases[cmd]}__ : *${consoleCommands[consoleAliases[cmd]]}*\n\n`)
            }
        }
        _$(`*Atom Console is an extension for Atom that allows the execution of commands via a small panel at the bottom of the window, inspired by the Emacs text-editor's 'M-x' feature.
This document contains a list of all the built-in Atom commands as well as the custom commands that come with Atom-Console*\n\n`);
        _$(`## Built-in Atom Commands\n\n
These commands come with atom and are created within packages.
They can be manually executed in the developer console with \`atom.commands.dispatch(view, command)\`, or by name in \`atom-console\`.\n\n`);
        for (let cmd in commands) {
            if (commands.hasOwnProperty(cmd)) {
                _$(`* __${commands[cmd]}__\n\n`);
            }
        }
        atom.commands.dispatch(atom.views.getView(atom.workspace.getActiveTextEditor()), "markdown-preview:toggle");
        editor.getBuffer().save();
        atom.workspace.getActivePane().destroyItem();
        fs.unlink(editor.getPath(), function(err){
          if (err) {
            throw err;
          }
        });
        return true;
    }, function() {
        console.log('Atom-Console Commands.md buffer failed to open.');
        return false;
    });
  }
}
