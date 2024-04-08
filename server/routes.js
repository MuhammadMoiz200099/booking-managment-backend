const path = require('path');
const api = require('./api');

function routes(app) {
  app.use('/api', api);
  
}

module.exports = routes;
