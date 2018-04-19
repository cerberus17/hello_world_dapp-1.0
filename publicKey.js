const util = require('ethereumjs-util');
console.log(util.privateToPublic(process.argv[2]).toString('hex'));

