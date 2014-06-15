var colors = require('colors');

colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  info: 'grey',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red',
  success: 'green',
  highlight: 'cyan'
});

exports.createPlugin = require('./cli/plugin');
exports.createApp = require('./cli/app');
exports.runApp = require('./cli/run');