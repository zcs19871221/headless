const fs = require('graceful-fs');
const path = require('path');

fs.writeFileSync(
  path.join(__dirname, '../dist/package.json'),
  fs.readFileSync(path.join(__dirname, '../package.json')),
);
fs.writeFileSync(
  path.join(__dirname, '../dist/readme.md'),
  fs.readFileSync(path.join(__dirname, '../readme.md')),
);
