'use babel';

const sys = require('util');
const exec = require('child_process').exec;

export default class PackageInstaller {

    isInteractive: null;
    method: null;
    prefix: null;
    pkg: null;

    constructor() {
        this.isInteractive = true;
        this.prefix = 'Install package: ';
        this.method = 'packageInstall';
    }

    packageInstall(pkg) {
        let exists;

        // Check if the package actually exists
        function checkPackage(error, stdout, stderr) {
            exec(`curl -s --head https://atom.io/packages/${pkg} | head -n 1 | grep "HTTP/1.[01] [23].."`, checkPackageExists);

            function checkPackageExists() {
                if (error) {
                    throw error;
                }

                if (!stdout.length == 0) {
                    exists = true;
                } else {
                    exists = false;
                }
            }

            return exists;
        }

        // Installs the package
        function getPackage(error, stdout, stderr) {
            exec(`apm install ${pkg}`, installPackage);

            function installPackage(error, stdout, stderr) {
                if (!error && stderr == '') {
                    return [true, stdout];
                } else if (error || stderr != '') {
                    return [false, stderr || error];
                }
            }
        }

        if (checkPackage()) {
            let getPackageOutput = getPackage();
            let success = getPackageOutput[0];
            let error = getPackageOutput[1];
            let errorMessage;
            if (!success) {
                if (!error) {
                    errorMessage = `: ${error}`;
                } else {
                    errorMessage = '';
                }
                return `There was an error installing the package${errorMessage}`;
            } else {
                return
            }
        } else {
            return `${pkg}[No Match]`;
        }


    }
}
