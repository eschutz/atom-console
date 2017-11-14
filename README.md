# atom-console package

[![Build Status](https://travis-ci.org/eschutz/atom-console.svg?branch=master)](https://travis-ci.org/eschutz/atom-console) [![Build status](https://ci.appveyor.com/api/projects/status/6ba8t60j9nvwkhxr/branch/master?svg=true)](https://ci.appveyor.com/project/eschutz/atom-console/branch/master)

An Emacs-style console interface for Atom.

![console_gif](https://cloud.githubusercontent.com/assets/17667220/19153791/74b184d0-8c1f-11e6-9829-8b654ceb99bc.gif)

## Features

- Execute any Atom command from a convenient console, as opposed to the built in command palette.
- Execute custom commands!
- Autocomplete!
- Convenient tools: a bash shell, calculator, package installation, aliases, and more!

## Installation

The latest stable version of atom-console is available through Atom's package manager in the settings or via<br>
`apm install atom-console`.

Install the latest Github release (may be unstable) with:

```
cd ~/.atom/packages
git clone https://github.com/eschutz/atom-console.git atom-console
cd atom-console
apm install
```

## Usage

Toggle `atom-console` with `alt-ctrl-x`, then enter any command specified within Atom. To see all available commands, open `atom-console` and type 'help'. To search for commands, type 'find'. Auto-complete with `tab`.

Some currently included non-Atom commands include commands bound to all grammar options in Atom (`[lang]-mode`) and `package-install`. A list of all built-in custom commands can be found in the [commands](#commands) section.

As development continues, more custom commands will be added, especially ones inspired by Emac's `M-x` console.

## Commands

Atom Console contains all of Atom's commands available via the command palette, as well as a growing list of custom commands, such as `[lang]-mode`, `package-install`. and `shell`.

For more information and a complete list of custom commands, see [the command documentation](./commands.md).

## Keymaps

   Keymap    |            Effect
:----------: | :---------------------------:
`ctrl-alt-x` |     Toggle `atom-console`
`ctrl-alt-g` | Stop currently executing tool
`ctrl-alt-c` |     Focus `atom-console`

## Contributing

Bug reports, suggestions etc. are welcome on Github <https://github.com/eschutz/atom-console/issues>.

If you've developed a neat tool that you think everyone would love, feel free to submit a pull request!

## Troubleshooting
If some commands do not work immediately after installation, try reloading Atom with `⌃⌥⌘L` (ctrl-option-cmd-L) and using `atom-console`.

## License

This package is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
