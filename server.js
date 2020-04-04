const app = require('./app');

process.env.NODE_ENV = "production";

// app.httpServer.listen(8080);
app.httpsServer.listen(8443);