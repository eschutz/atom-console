'use babel';

const exec = require('child_process').exec;

export default class PackageInstaller {

    constructor() {
        this.isInteractive = true;
        this.prefix = 'Install package: ';
        this.async = true;
    }

    run(pkg) {
      let _this = this, returnString;
      _this.output = null;

        // Installs the package
        function getPackage(callback) {
          if (pkg == '') {
            returnString = "";
            return;
          };
          exec(`apm install ${pkg}`, callback);
        }

        getPackage(function(error, stdout, stderr) {
          if (error && error.toString().includes("Not Found")) {
            returnString = `${pkg}[No Match]`;
          } else if (error && error.toString().includes("ENOTFOUND")) {
            returnString = "There was a network error! Try again later. [Enter to continue]";
            atom.notifications.addError(`Installing ${pkg} failed.`, {description:'There was an error with the network, try again later.', stack:error.toString(), icon:'zap'})
          } else if (stderr) {
            returnString = "There was an error installing the package! [Enter to continue]";
            atom.notifications.addError(`Installing ${pkg} failed.`, {description:`There was an error when installing the package. This may be an issue with the package, which can be raised on its [GitHub page](https://atom.io/packages/${pkg}).`, stack:stderr, icon:'zap'});
          } else if (stdout){
            returnString = `Installing ${pkg}... [Enter to continue]`;
            atom.notifications.addSuccess(`${pkg} package sucessfully installed!`);
            atom.packages.activatePackage(pkg);
          } else {
            returnString = "Error!";
          };
          _this.output = returnString;
        });

    }
}
