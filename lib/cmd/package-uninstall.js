'use babel';

const exec = require('child_process').exec;

// A copy of package-install that uninstalls a package
export default class PackageUninstaller {

    constructor() {
        this.isInteractive = true;
        this.prefix = 'Uninstall package: ';
        this.method = 'packageUninstall';
        this.networkTool = true;
    }

    packageUninstall(pkg) {
      _this = this

        // Uninstalls the package
        function uninstallPackage(callback) {
          if (pkg == '') {
            _this.output = "";
            return
          };
          exec(`apm uninstall ${pkg}`, callback)
        }

        uninstallPackage(function(error, stdout, stderr) {
          if (error && error.toString().includes("Does not exist")) {
            _this.output = "The specified package is not installed! [Enter to continue]";
          } else if (stderr) {
            _this.output = "There was an error uninstalling the package! [Enter to continue]"
          } else if (stdout){
            _this.output = `Uninstalled ${pkg}... [Enter to continue]`;
            atom.packages.deactivatePackage(pkg);
          } else {
            _this.output = "Error!"
          };
        });
    }
}
