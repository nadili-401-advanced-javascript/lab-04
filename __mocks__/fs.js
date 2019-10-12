'use strict';

module.exports = exports = {};

exports.readFile = (file, cb) => {
  if (file.match(/bad/i)) {
    cb('Invalid File');
  } else {
    cb(undefined, new Buffer('{ "firstName": "Tim", "lastName": "David" }'));
  }
};

exports.writeFile = ('file', 'new string', (err) => {
  if(err) {
    return console.log(err);
  }
  console.log('The file was saved!');
});