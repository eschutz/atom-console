# atom-console package
[![Build Status](https://travis-ci.org/eschutz/atom-console.svg?branch=master)](https://travis-ci.org/eschutz/atom-console)
[![Build status](https://ci.appveyor.com/api/projects/status/6ba8t60j9nvwkhxr/branch/master?svg=true)](https://ci.appveyor.com/project/eschutz/atom-console/branch/master)

An Emacs-style console interface for Atom.

![console_gif](https://cloud.githubusercontent.com/assets/17667220/19153791/74b184d0-8c1f-11e6-9829-8b654ceb99bc.gif)

## Installation
atom-console is not currently available for installation via `apm install atom-console`, however it will be soon.
Until that is implemented:

```
cd ~/.atom/packages
git clone https://github.com/eschutz/atom-console.git atom-console
cd atom-console
apm install
```

## Usage
Toggle `atom-console` with `alt-ctrl-x`, then enter any command specified within Atom. To see all available commands, open the developer console and type `atom.commands.registeredCommands`.

In future custom commands (especially ones inspired by Emac's `M-x` console) will be added, such as `package-install`.

## Features
* Execute any Atom command from a more traditional console, as opposed to the built in command palette
* Perform custom commands that execute Javascript (soon)

## Contributing
Bug reports, suggestions etc. are welcome on Github https://github.com/eschutz/atom-console.

## License
This package is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
