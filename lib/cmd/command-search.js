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

// Tool to search for commands
export default class CommandSearch {

    constructor() {
        this.isInteractive = true;
        this.method = "search";
        this.prefix = "Search for command:  ";
        this.COMMANDS = Object.keys(atom.commands.registeredCommands).concat(Object.keys(require('../command/aliases')));
    }

    search(term) {
        let results = [];
        let returnValue;
        for (let cmd in this.COMMANDS) {
            if (this.COMMANDS.hasOwnProperty(cmd)) {
                if (this.COMMANDS[cmd].match(new RegExp(term), "gi")) {
                    results.push(this.COMMANDS[cmd]);
                }
            }
        }

        if (!results.length || !term.length) {
            this.clearConsoleAfterSubmit = false;
            this.specialOutput = `${term}[No Match]`;
            returnValue = false;
        } else {
            this.clearConsoleAfterSubmit = true;
            returnValue = true;
            this.specialOutput = null;
            let mdPath = `${process.env['ATOM_HOME']}/packages/atom-console/lib/tmp/Command Search Results.md`
            atom.workspace.open(mdPath).then(() => {
                const editor = atom.workspace.getActiveTextEditor();
                editor.insertText(`# Search Results\n\n__Search Term: *${term}* __\n\n`);
                for (let r in results) {
                    editor.insertText(`* ${results[r].replace(term, `__${term}__`)}\n\n`);
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

                this.specialOutput = null;
                returnValue = true;
            }, () => {
                console.log("Command Search failed!");
            });
        }

        return returnValue;
    }

}
