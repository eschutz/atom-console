# atom-console package

[![Build Status](https://travis-ci.org/eschutz/atom-console.svg?branch=master)](https://travis-ci.org/eschutz/atom-console) [![Build status](https://ci.appveyor.com/api/projects/status/6ba8t60j9nvwkhxr/branch/master?svg=true)](https://ci.appveyor.com/project/eschutz/atom-console/branch/master)

An Emacs-style console interface for Atom.

![console_gif](https://cloud.githubusercontent.com/assets/17667220/19153791/74b184d0-8c1f-11e6-9829-8b654ceb99bc.gif)

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

Toggle `atom-console` with `alt-ctrl-x`, then enter any command specified within Atom. To see all available commands, open the developer console and type `atom.commands.registeredCommands`.

Currently included non-Atom commands include `[lang]-mode` and `package-install`. For more information see the [commands](#commands) section.

As development continues, more custom [commands](#commands) will be added, especially ones inspired by Emac's `M-x` console.

## Features

- Execute any Atom command from a more traditional console, as opposed to the built in command palette
- Perform custom commands that execute Javascript

## Commands

See [the command documentation](./commands.md).

## Keymaps

   Keymap    |            Effect
:----------: | :---------------------------:
`ctrl-alt-x` |     Toggle `atom-console`
`ctrl-alt-g` | Stop currently executing tool
`ctrl-alt-c` |     Focus `atom-console`

## Contributing

Bug reports, suggestions etc. are welcome on Github <https://github.com/eschutz/atom-console/issues>.

## License

This package is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
