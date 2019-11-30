require('babel-register')({
  presets: ['env']
});

module.exports = require('./my-koa-app.js');
