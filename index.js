const server = require('./services/server');
const log = console.log;

const startServers = () => {
  try {
    log('**** Initializing web server ****');
    server.init();
  } catch (error) {
    console.error(error);
    process.exit(1); // Non-zero failure code
  }
};

startServer();
