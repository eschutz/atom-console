## 0.4.6
* Tweaked text colour to fix display issues in Atom Material UI + bug fixes – [Issue #4](https://github.com/eschutz/atom-console/issues/4)

## 0.4.5
* Menu changes

## 0.4.4
* Added exponentiation to the calculator via `**`
* Added `reload` alias for `window-reload`
* Bug fixes

## 0.4.3
* Replaced Tool attribute `this.networkTool` with `this.async`
* Fixed some bugs with autocomplete
* Fixed cursor indentation in atom-console
* Fixed some bugs with `package-install` and `package-uninstall`

## 0.4.2
* Completely rewrote autocomplete system, using a nice efficient [trie](https://en.wikipedia.org/wiki/Trie) structure instead of manual search.
* Completely rewrote the calculator. It should now be more stable and actually works!
* `cmp` can now compile Pascal code!

## 0.4.1
* Edited `lib/atom-console.js` so spec won't fail.

## 0.4.0
* Completely rewrote command execution system
* Removed `lib/command/tool-imports.js` and merged it with `lib/command/command-imports.js`
* Removed `this.specialOutput` and `this.output` from tool variables, now the return value of the `run()` function is used instead.
* Added commands:
  * `add-alias`
  * `remove alias`
  * `create-command`
  * `create-tool`
* Altered `commands.md` to reflect changes to the alias system
* Added some Vim aliases

## 0.3.11
* Fixed actual source of `getGrammars()` problem (previously mistaken as `atom.grammars`)
* Added autocomplete - bound to `tab`

## 0.3.10
* Temporary hotfix for `atom.grammars` returning undefined (This is likely a bigger issue in Atom itself)

## 0.3.9
* Added file check before clearing `lib/tmp`

## 0.3.8
* Added `cmp` command
* Fixed `help` command to use `lib/tmp` for temporary markdown
* Bug fixes

## 0.3.7
* Removed deprecated `::shadow` CSS selector

## 0.3.6
* Added file temporary directory `lib/tmp` for tools that open new buffers (e.g. `shell`, `find`) and other temporary files. See `commands.md` for more information.
  * This gets cleared when atom-console gets toggled out of the screen
* Fixed build error: https://github.com/atom/atom/blob/56692460265c2f610f5347295e121d0cb1b24a34/src/text-editor-component.coffee#L758
* Fixed a bug where native atom commands produced `[No Match]`

## 0.3.5
* Fixed bug with calculator

## 0.3.4
* Fixed bug with version 1.12.2 of Atom where the console could not be selected

## 0.3.3
* Updated README

## 0.3.2
* Added `goto-line` and `what-line` commands
* Rewrote the command execution system

## 0.3.1
* Added console history
* Added individual history option for tools
* Added native support for setting grammar
* Removed `set-syntax-emacs` from Atom Package dependencies
* Removed npm package Atom Package Dependencies from dependencies

## 0.3.0
* Added commands:
  * `package-uninstall`
  * `shell`
  * `calculator`
* Fixed an issue with `find`

## 0.2.5
* Fixed issue with command execution

## 0.2.4
* Added `help` and `find` commands

## 0.2.3
* Updated README

## 0.2.2
* Updated the border of the bottom panel not to show while `atom-console` is toggled

## 0.2.1
* Added loading symbol for network tools
* Improved styling
* Added focus keymap
* Code styling improvements

## 0.2.0
* Added `[language]-mode` and `package-install` commands
* Added terminal Octicon

## 0.1.1
* Fixed build error on some platforms

## 0.1.0 - First Release
* Initial release
