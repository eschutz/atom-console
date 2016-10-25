'use babel';

// Import any custom command files for them to be loaded into
// Atom Console

import languageMode from '../cmd/lang-mode';
import listCommands from '../cmd/list-commands'
// e.g. import myCommand from '../cmd/mycommand'

export default class CustomCommands {

    CUSTOM_COMMANDS: null;
    constructor() {
      this.CUSTOM_COMMANDS = {
        // Be sure to exclude the brackets when listing functions here,
        // as with brackets the function is evaluated, whereas without
        // it refers to the function object itself

        // e.g "myCommand":myCommand,
        // *Do not edit the following*
        "languageMode":languageMode,
        "listCommands":listCommands
    };
  }
};
