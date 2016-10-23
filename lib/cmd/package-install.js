'use babel';

const exec = require('child_process').exec;

export default class PackageInstaller {

    isInteractive: null;
    method: null;
    prefix: null;
    networkTool: null;
    output: null;

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
          } else if (stderr) {
            _this.output = "There was an error installing the package! [Enter to continue]"
          } else if (stdout){
            _this.output = `Installing ${pkg}... [Enter to continue]`;
          } else {
            _this.output = "Error!"
          };
        });
    }
}
