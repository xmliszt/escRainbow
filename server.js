const app = require('./app');

// PRODUCTION
const PORT = process.env.PORT || 3000;

process.env.NODE_ENV = "production";

// app.listen(8080);
app.app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);});
