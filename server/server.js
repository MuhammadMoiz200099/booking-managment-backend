require('./common/env');
const Server = require('./common/server');
const routes = require('./routes');
const { connectDB } = require('./common/database');

connectDB()
  .then(async () => {

  }, () => { });

module.exports = new Server()
  .router(routes)
  .listen(parseInt(process.env.PORT, 10));