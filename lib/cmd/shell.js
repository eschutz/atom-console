'use babel';

const exec = require('child_process').exec;

// Simple shell interface tool for Atom Console
export default class ConsoleShell {

    openShell() {
      let shellFile = `${process.env['ATOM_HOME']}/packages/atom-console/lib/tmp/atom-console shell.sh`;
      let _this = this;
      return atom.workspace.open(shellFile).then(function() {
        let editors = atom.workspace.getTextEditors();
        for (let e in editors) {
          if (editors[e].getTitle() == 'atom-console shell.sh') {
            this.textEditor = editors[e];
          }
        }
          _this.lineNum = 1;
          this.textEditor.setText(`${new Date()}\n[${_this.lineNum}] shell$ `);
          this.textEditor.setCursorBufferPosition([this.textEditor.getBuffer().lines.length, 0]);
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
        this.historyFile = `${process.env.ATOM_HOME}/packages/atom-console/lib/cmd/shell-history.json`;
        fs.access(this.historyFile, err => fs.writeFile(this.historyFile, '[]', err => {if (err) { console.log('Could not create shell-history file!'); throw err; }}));
    }

    execute(cmd) {
      let textBuffer;
      let _this = this;
      _this.lineNum = this.lineNum || 1;
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
          this.textEditor.save();
        });
      }

      let editors = atom.workspace.getTextEditors();
      for (let e in editors) {
        if (editors[e].getTitle() == 'atom-console shell.sh') {
          textBuffer = editors[e];
        }
      }
      if (!textBuffer) {
        this.openShell();
      } else {
        this.specialOutput = "\b";
        this.clearConsoleAfterSubmit = true;
        executeCommand();
      }

  }
}
