'use babel';

const sys = require('sys');
const exec = require('child_process').exec;

export default function packageInstaller() {
    function packageInstall(pkg) {
        let exists;

        // Check if the package actually exists
        function checkPackage(error, stdout, stderr) {
            exec(`curl -s --head https://atom.io/packages/${pkg} | head -n 1 | grep "HTTP/1.[01] [23].."`, checkPackageExists);

            checkPackageExists() {
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
                if (error == null && stderr == '') {
                    return true;
                } else if (error != null || stderr != '') {
                    return false;
                }
            }
        }

        if (checkPackage) {
            if (!getPackage) {
                return "There was an error installing the package"
            }
        } else {
            return false;
        }


    }
}
