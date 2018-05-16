'use babel';

import fs from 'fs';

const exec = require('child_process').exec;

const getEditorByTitle = title => {
  let editors = atom.workspace.getTextEditors();
  for (let e of editors) {
    if (e.getTitle() == title) {
      return e;
    }
  }
}

// Simple shell interface tool for Atom Console
export default class ConsoleShell {

    openShell() {
      let shellFile = `${process.env['ATOM_HOME']}/packages/atom-console/lib/tmp/atom-console shell.sh`;
      return atom.workspace.open(shellFile).then(() => {
          this.textEditor = getEditorByTitle('atom-console shell.sh');
          this.lineNum = 1;
          this.textEditor.setText(`${new Date()}\n[${this.lineNum}] shell$ `);
          this.textEditor.setCursorBufferPosition([this.textEditor.getBuffer().getLines().length, 0]);
          this.textEditor.save();
          atom.commands.dispatch(atom.views.getView(atom.workspace.getActiveTextEditor()), 'atom-console:focus');
      });
  }

    constructor() {
        this.isInteractive = true;
        this.prefix = "shell$  ";
        this.returnString = "\b";
        this.clearConsoleAfterSubmit = true;
        this.openShell();
        this.historyFile = `${process.env.ATOM_HOME}/packages/atom-console/lib/cmd/shell-history.json`;
        fs.access(this.historyFile, err => fs.writeFile(this.historyFile, '[]', err => {if (err) { console.log('Could not create shell-history file!'); throw err; }}));
    }

    run(cmd) {
      let textBuffer;
      this.lineNum = this.lineNum || 1;
      const executeCommand = () => {
        textBuffer.insertText(`${cmd}\n`);
        let _shell = (process.platform == 'win32') ? 'cmd.exe':'/bin/bash';
        exec(cmd, {cwd:process.env.HOME, env:process.env, shell:_shell},
        (error, stdout, stderr) => {
          let output;
          if (stderr.length) {
            output = stderr;
          } else {
            output = stdout;
          }
          this.lineNum++;
          textBuffer.insertText(`${output}[${this.lineNum}] shell$ `);
          this.textEditor.save();
        });
      }

      textBuffer = getEditorByTitle('atom-console shell.sh');
      if (!textBuffer) {
        this.openShell();
      } else {
        this.clearConsoleAfterSubmit = true;
        executeCommand();
      }

      return this.returnString;
  }
}
