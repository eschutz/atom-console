'use babel';

// Import any custom tool files for them to be loaded into
// Atom Console

import PackageInstaller from '../cmd/package-install';
// e.g. import myTool from '../cmd/mytool'

export default class CustomTools {

    CUSTOM_TOOLS: null;
    constructor() {
      this.CUSTOM_TOOLS = {
        // Be sure to exclude the brackets when listing functions here,
        // as with brackets the function is evaluated, whereas without
        // it refers to the function object itself

        // e.g. "myTool":myTool,

        // *Do not edit the following*
        "PackageInstaller":PackageInstaller
    };
  }
};
