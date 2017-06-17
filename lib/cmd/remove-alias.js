'use babel';

const fs = require('fs');
const ALIAS_PATH = `${process.env.ATOM_HOME}/packages/atom-console/lib/command/aliases.json`;

export default class AliasRemover {

  constructor() {
    this.isInteractive = true;
    this.prefix = 'Alias: ';

    fs.readFile(ALIAS_PATH,
      (err, data) => {
        if (err) throw(err);
        this.aliases = JSON.parse(String.fromCharCode(...data));
      }
    );

  }

  run(input) {
    let alias = input.trim(), returnString;
    if (alias) {
      if (this.aliases[alias]) {
        delete this.aliases[alias];
        returnString = `Alias '${alias}' successfully removed.`;
        fs.writeFile(
          ALIAS_PATH,
          JSON.stringify(this.aliases),
          err => {
            if (err) {
              console.error(err);
              returnString = 'There was an error writing to file!';
            }
          }
        )
      } else {
        returnString = `Alias '${alias}' does not exist!`;
      }
      return returnString;
    }

    return true;
  }

}
