'use babel';

const fs = require('fs');

const TOOL_PATH = `${process.env.ATOM_HOME}/packages/atom-console/lib/cmd/my-tool.js`;

const TOOL_CONTENT = `'use babel';

export default class myTool() {

  // *NOTE*
  // Don't forget to import and add your tool to lib/command/command-imports.js
  // Otherwise atom-console will not know it exists

  constructor() {
    this.isInteractive = true;
    // Initialize tool variables here, e.g. \`this.prefix\` etc.
  }

  run(input) {
    // \`run()\ gets executed every time return is pressed while the tool is active
    // \`input\` is the text content of the console
    // The return value of \`run()\` will be output to the console
  }

}`

export default function createTool() {
  fs.writeFile(
    TOOL_PATH,
    TOOL_CONTENT,
    err => {
      if (err) {
        console.error(err);
        return 'There was an error creating the file!';
      }
    }
  );
  return `Tool created successfully! Path: ${TOOL_PATH}`;
}
