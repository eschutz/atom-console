'use babel';

const fs = require('fs');
const ALIAS_PATH = `${process.env.ATOM_HOME}/packages/atom-console/lib/command/aliases.json`;

export default class AliasCreator {
  constructor() {
    this.isInteractive = true;
    this.originalPrefix = 'Alias name: '
    this.prefix = this.originalPrefix;
    fs.readFile(ALIAS_PATH,
      (err, data) => {
        if (err) throw(err);
        this.aliases = JSON.parse(String.fromCharCode(...data));
      }
    );
    this.aliasName = null;
    this.aliasFunction = null;
  }

  run(input) {
    if (this.aliasName && this.aliasName.trim()) {
      if (input.trim()) {
        let aliasAddition = {}, returnString;
        this.aliasFunction = input.trim();
        if (this.aliasFunction.includes(',')) {
          this.aliasFunction = this.aliasFunction.split(/\s*,\s*/);
        }
        aliasAddition[this.aliasName] = this.aliasFunction;
        returnString = `Alias written successfully: ${this.aliasName} -> ${aliasAddition[this.aliasName]}`;
        fs.writeFile(
          ALIAS_PATH,
          JSON.stringify(Object.assign(this.aliases, aliasAddition)),
          err => {
            if (err) {
              returnString = 'There was an error writing the alias to file!';
            }
          }
        );
        this.prefix = this.originalPrefix;
        this.aliasName = null;
        this.aliasFunction = null;
        return returnString;
      }
    } else {
      if (input.trim()) {
        this.aliasName = input.trim();
        this.prefix = 'Alias function: ';
      }
    }
    return true;
  }
}
