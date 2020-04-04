const app = require('./app');
const PORT = process.env.PORT || 3000;

process.env.NODE_ENV = "production";

// app.httpServer.listen(8080);
app.httpsServer.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);});