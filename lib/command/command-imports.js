'use babel';

// Import any custom command/tool files for them to be loaded into
// Atom Console

import languageMode from '../cmd/lang-mode';
import listCommands from '../cmd/list-commands'
import whatLine from '../cmd/what-line';
import compile from '../cmd/cmp';
import createTool from '../cmd/create-tool';
import createCommand from '../cmd/create-command';
// e.g. import myCommand from '../cmd/mycommand'
import PackageInstaller from '../cmd/package-install';
import CommandSearch from '../cmd/command-search';
import ConsoleShell from '../cmd/shell';
import PackageUninstaller from '../cmd/package-uninstall';
import Calculator from '../cmd/calculator';
import GoToLine from '../cmd/goto-line';
import AliasCreator from '../cmd/add-alias';
import AliasRemover from '../cmd/remove-alias';
// e.g. import myTool from '../cmd/mytool'

export default class CustomCommands {

    constructor() {
      this.CUSTOM_COMMANDS = {

        // To add a command or tool, add:
        // e.g "myCommand":myCommand
        // e.g. "myTool":["startTool", myTool]

        // *Do not edit the following*
        "rx:.+-mode":languageMode,
        "listCommands":listCommands,
        "whatLine":whatLine,
        "compile":compile,
        "PackageInstaller":["startTool", PackageInstaller],
        "CommandSearch":["startTool", CommandSearch],
        "ConsoleShell":["startTool", ConsoleShell],
        "PackageUninstaller":["startTool", PackageUninstaller],
        "Calculator":["startTool", Calculator],
        "GoToLine":["startTool", GoToLine],
        "AliasCreator":["startTool", AliasCreator],
        "AliasRemover":["startTool", AliasRemover],
        "createTool":createTool,
        "createCommand":createCommand
    };
  }
};
