# Commands
There are currently a limited number of non-atom commands implemented in `atom-console`, however more will be added in future.

Atom Console can also be extended with [custom commands](#custom-commands).

### Contents
* [Built-in Commands](#built-in-commands)
* [Custom Commands](#custom-commands)
* [Tools](#tools)
* [Aliases](#aliases)

## Built-in Commands
These are the non-atom commands that can be executed in `atom-console`.
* __[language]-mode__
  * Changes the language mode of the current file, e.g. `ruby-mode`.
* __package-install__, __(package-uninstall)__
  * Starts an atom-console [sub-process](#tools), which installs the given atom package name.
* __help__, __commands__
  * Displays a help buffer containing all available commands.
* __find__, __find-command__, __search__
  * Search for a command.
* __shell__, __terminal__
  * Initialises a simple bash shell in a new buffer, with input from the console.
* __calculator__, __calc__
  * A simple calculator

## Custom Commands
Atom Console is extendable via custom commands and [tools](#tools), which are written in JavaScript.

Currently the only example of a custom command natively in Atom Console is `[language]-mode`, the source for which can be found in `lib/cmd/lang-mode.js`.

### Creating a Custom Command
Commands are single-file functions that can take arguments or be executed without arguments, and abide by the syntax:
```javascript
export default function myCommand() {
  // If any arguments are given, return false
  if (!(arguments.length == 0)) {
    return false;
  } else {
  // myCommand code here
  }
}
```
This would then be saved to a file: `lib/cmd/my-command.js`.

(Note: commands/tools don't *have* to be saved to `lib/cmd/`, but it's much cleaner if they're all kept in one directory.)

To make `my-command` executable in `atom-console`, open up `lib/command/command-imports.js`:

Append `import myCommand from '../cmd/my-command.js'` to the start of the file.

Then, inside the `CustomCommands` class, insert your command into the namesake hash:
```javascript
export default class CustomCommands {
    CUSTOM_COMMANDS: null;
    constructor() {
      this.CUSTOM_COMMANDS = {
        "myCommand":myCommand
    };
  }
};
```
Reload Atom and execute `myCommand`!

#### Commands with arguments
Commands can be created with arguments and then anonymously called, e.g. if `foo-bar` is entered into Atom Console and doesn't match any command name, it will be passed as an argument to each command until one returns `true`. As this is the case, please always return a value (`true` if the command executed correctly, `false` if anything else) and ensure that if your command does not take any arguments, return `false` if any are given.

## Tools
Tools, put simply, are [commands](#custom-commands) that take user input. Often a new console prefix is created to indicate that a tool is running, and all input from the console is passed to the tool.

![tool_example](https://cloud.githubusercontent.com/assets/17667220/19625659/441bf612-9966-11e6-86af-933a4547281a.gif)

Tools are classes that have a main function that takes user-input and does something with it, as shown by the `package-install` example.

Tools have available to them a number of variables:

__Mandatory__
* `isInteractive`: always set to `true` for a tool
* `method`: the name of the main method (as a string) that will be passed user input

__Optional__
* `prefix`: the string preceding the input field, e.g. "Install package"
* `networkTool`: set to `true` if the tool interacts with the internet, so `atom-console` knows to set a timeout
* `output`: message to be output to console, mandatory if `networkTool` is true
* `specialOutput`: the same as `output`, except for use when the tool does not interact with the internet (Note: currently this is not implemented, check back soon for further developments)
* `clearConsoleAfterSubmit`: option to clear the console when the `return` key is pressed, instead of having custom or default output

For a reference, look at `lib/cmd/package-install.js`.

Tools are installed into `atom-console` similarly to commands, except they use the `lib/command/tool-imports.js` file and __must be [aliased](#aliases)__.

If there are any errors with tools, feel free to submit a bug report as the tool system is fairly complex and error-prone.

## Aliases
Atom Console supports aliases to create shortcuts for common [commands](#custom-commands) and commands that invoke [tools](#tools).

Aliases are set in `lib/command/aliases.json`, with the syntax `"command-name":"foo:bar"`, or in the case of a tool `"execute-tool":"ToolClassName"`. For example:
```json
{
  "package-install":"PackageInstaller",
  "reload":"window:reload"
}
```
This allows the package installer to be executed via the command `package-install` and atom to be reloaded with `reload`. __Do not remove pre-set aliases from `aliases.json`__.
