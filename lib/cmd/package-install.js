'use babel';

const exec = require('child_process').exec;

export default class PackageInstaller {

    constructor() {
        this.isInteractive = true;
        this.prefix = 'Install package: ';
        this.method = 'packageInstall';
        this.networkTool = true;
    }

    packageInstall(pkg) {
      _this = this

        // Installs the package
        function getPackage(callback) {
          if (pkg == '') {
            _this.output = "";
            return
          };
          exec(`apm install ${pkg}`, callback)
        }

        getPackage(function(error, stdout, stderr) {
          if (error && error.toString().includes("Not Found")) {
            _this.output = `${pkg}[No Match]`;
          } else if (error && error.toString().includes("ENOTFOUND")) {
            _this.output = "There was a network error! Try again later. [Enter to continue]";
            atom.notifications.addError(`Installing ${pkg} failed.`, {description:'There was an error with the network, try again later.', stack:error.toString(), icon:'zap'})
          } else if (stderr) {
            _this.output = "There was an error installing the package! [Enter to continue]";
            atom.notifications.addError(`Installing ${pkg} failed.`, {description:`There was an error when installing the package. This may be an issue with the package, which can be raised on its [package page](https://atom.io/packages/${pkg}).`, stack:stderr, icon:'zap'});
          } else if (stdout){
            _this.output = `Installing ${pkg}... [Enter to continue]`;
            atom.notifications.addSuccess(`${pkg} package sucessfully installed!`);
            atom.packages.activatePackage(pkg);
          } else {
            _this.output = "Error!"
          };
        });
    }
}
