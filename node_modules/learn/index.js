require('babel-register')({
  presets: ['es2015'],
  ignore: function(filename) {
    return !filename.match(/learn\/main/) && !filename.match(/learn\/lib/);
  }
});
module.exports = require('./main').default;
