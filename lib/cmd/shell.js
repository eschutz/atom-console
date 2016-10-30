'use babel';

const exec = require('child_process').exec;

// Simple shell interface tool for Atom Console
export default class ConsoleShell {

    openShell() {
    return atom.workspace.open("atom-console shell.sh").then(function() {
      let editors = atom.workspace.getTextEditors();
      for (let e in editors) {
        if (editors[e].getTitle() == 'atom-console shell.sh') {
          this.textBuffer = editors[e];
        }
      }
        this.textBuffer.setText('[1] shell$ ');
        atom.commands.dispatch(atom.views.getView(atom.workspace.getActiveTextEditor()), 'atom-console:focus');
    });
  }

    constructor() {
        this.isInteractive = true;
        this.method = "execute";
        this.prefix = "shell$  ";
        this.specialOutput = "\b";
        this.clearConsoleAfterSubmit = true;
        this.openShell();
        this.lineNum = 1;
        this.historyFile = `${process.env.ATOM_HOME}/packages/atom-console/lib/cmd/shell-history.json`;
        fs.access(this.historyFile, err => fs.writeFile(this.historyFile, '[]', err => {if (err) { console.log('Could not create shell-history file!'); throw err; }}));
    }

    execute(cmd) {
      let textBuffer;
      let _this = this;
      function executeCommand() {
        textBuffer.insertText(`${cmd}\n`);
        let _shell = (process.platform == 'win32') ? 'cmd.exe':'/bin/bash';
        exec(cmd,{cwd:process.env.HOME, env:process.env, shell:_shell},
        function (error, stdout, stderr) {
          let output;
          if (stderr.length) {
            output = stderr;
          } else {
            output = stdout;
          }
          _this.lineNum++;
          textBuffer.insertText(`${output}[${_this.lineNum}] shell$ `);
        });
      }

      let editors = atom.workspace.getTextEditors();
      for (let e in editors) {
        if (editors[e].getTitle() == 'atom-console shell.sh') {
          textBuffer = editors[e];
        }
      }
      if (!textBuffer) {
        this.specialOutput = "Shell buffer not open!";
        this.clearConsoleAfterSubmit = false;
      } else {
        this.specialOutput = "\b";
        this.clearConsoleAfterSubmit = true;
        executeCommand();
      }

  }
}
