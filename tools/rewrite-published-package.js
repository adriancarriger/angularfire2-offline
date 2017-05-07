/**
 * Rewrite the package.json that gets published to npm.
 */
var fs = require('fs');
var srcPackage = require('../package');

delete srcPackage.scripts;

fs.writeFileSync('./dist/package.json', JSON.stringify(srcPackage, null, 2));

// It's also necessary to copy any deep-path package.json files.
// See https://github.com/angular/angularfire2/issues/880

fs.writeFileSync(`./dist/database/package.json`, fs.readFileSync(`./src/database/package.json`));
