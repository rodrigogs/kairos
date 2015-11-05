'use strict';

const Mocha = require('mocha'),
    fs = require('fs'),
    path = require('path');

const mocha = new Mocha();
const testDir = './test/browser/';

// Add test files
fs.readdirSync(testDir).filter(file => {
    // Only keep the .js files
    return file.substr(-3) === '.js';
}).forEach(file => {
    mocha.addFile(
        path.join(testDir, file)
    );
});

// Run mocha
mocha.run(failures => {
  process.on('exit', () => {
    process.exit(failures);
  });
});