'use babel';

const fs = require('fs');

const CMD_PATH = `${process.env.ATOM_HOME}/packages/atom-console/lib/cmd/my-command.js`;

const CMD_CONTENT = `'use babel';

// *NOTE*
// Don't forget to import and add your tool to lib/command/command-imports.js
// Otherwise atom-console will not know it exists

export default function myCommand() {
  // This function gets executed whenever your command is invoked
  // The return value is printed to the console
}
`

export default function createCommand() {
  fs.writeFile(
    CMD_PATH,
    CMD_CONTENT,
    err => {
      if (err) {
        console.error(err);
        return 'There was an error creating the file!';
      }
    }
  );
  return `Command created successfully! Path: ${CMD_PATH}`;
}
