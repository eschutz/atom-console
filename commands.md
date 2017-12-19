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
* __goto-line__
  * Go to the specified line
* __what-line__
  * Returns the line and column location of the cursor
* __compile__, __cmp__
  * Compiles the current file in the same directory with a language-specific compiler
  * Currently supports:
    * C/C++/Objective-C using `gcc`
    * Java
    * Swift
    * Go
    * Rust
    * Scala
    * Haskell
    * Lua
  * If you wish to add or change compilers, the source is found in `lib/cmd/cmp.js` and you can request additions via GitHub or email at elijah@jschutz.net
* __add-alias__, __(remove-alias, rm-alias)__
  * Creates an alias for any Atom or `atom-console` command.
  * You can alias multiple Atom-only commands by separating them with a comma, e.g. `core:save, core:close`.
* __create-tool__, __new-tool__
  * Creates a new tool template, located at `lib/cmd/my-tool.js`.
* __create-command__, __create-cmd__, __new-command__, __new-cmd__
  * Creates a new command template, located at `lib/cmd/my-command.js`.

## Custom Commands
Atom Console is extendable via custom commands and [tools](#tools), which are written in JavaScript.

Currently the only example of a custom command natively in Atom Console is `[language]-mode`, the source for which can be found in `lib/cmd/lang-mode.js`.

### Creating a Custom Command
Commands are single-file functions that can take arguments or be executed without arguments, and abide by the syntax:
```javascript
export default function myCommand() {
  // do something

  // The return value will be printed to the console
  return someValue;
}
```
This would then be saved to a file: `lib/cmd/my-command.js`.

(Note: commands/tools don't *have* to be saved to `lib/cmd/`, but it's best practice to keep them all in one directory.)

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

## Tools
Tools, put simply, are commands that take user input. Often a new console prefix is created to indicate that a tool is running, and all input from the console is passed to the tool.

![tool_example](https://cloud.githubusercontent.com/assets/17667220/19625659/441bf612-9966-11e6-86af-933a4547281a.gif)

Tools are classes that have a main function that takes user-input and does something with it, as shown by the `package-install` example.

Tools have a main function called `run(input)`, which is executed whenever `return` is pressed while the tool is active. The text content of the console is passed as an argument to run (`input`), and the return value of the function is printed to the console.

Tools have available to them a number of variables:

__Mandatory__
* `isInteractive`: always set to `true` for a tool

__Optional__
* `prefix`: the string preceding the input field, e.g. "Install package"
* `async`: set to `true` if the tool executes asynchronously, for example in interactions with the internet or filesystem, so `atom-console` knows to set a timeout
* `clearConsoleAfterSubmit`: option to clear the console when the `return` key is pressed, instead of having custom or default output
* `historyFile`: an __absolute__ path to a history JSON file containing an array (cannot be empty, ensure it contains at least '[]')

__Tools have available to them the `lib/tmp` directory, which gets automatically cleared when the console is toggled out of the screen. Save any temporary/buffer files there that are unneeded for future use.__

For a reference, look at `lib/cmd/package-install.js`.

Tools are installed into `atom-console` similarly to commands, except instead of the class name after the object key, it should be:
```javascript
    "myTool":["startTool", myTool]
```

## Aliases
Atom Console supports aliases to create shortcuts for common commands and tools.

Aliases are set in `lib/command/aliases.json`.
To create a new alias, use the `add-alias` atom-console command. Likewise, `remove-alias` removes the specified alias.

__Atom has to be reloaded after alias creation for the alias to work__
