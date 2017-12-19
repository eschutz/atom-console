'use babel';

const exec = require('child_process').exec;

// A copy of package-install that uninstalls a package
export default class PackageUninstaller {

	constructor() {
		this.isInteractive = true;
		this.prefix = 'Uninstall package: ';
		this.async = true;
	}

	run(pkg) {
		let _this = this, returnString;
		_this.output = null;

		// Uninstalls the package
		function uninstallPackage(callback) {
			if (pkg == '') {
				returnString = "";
				return
			};
			exec(`apm uninstall ${pkg}`, callback)
		}

		uninstallPackage(function(error, stdout, stderr) {
			if (error && error.toString().includes("Does not exist")) {
				returnString = "The specified package is not installed! [Enter to continue]";
			} else if (stderr) {
				returnString = "There was an error uninstalling the package! [Enter to continue]"
			} else if (stdout) {
				returnString = `Uninstalled ${pkg}... [Enter to continue]`;
				atom.packages.deactivatePackage(pkg);
			} else {
				returnString = "Error!"
			};
			_this.output = returnString;
		});
	}
}
