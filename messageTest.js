const express = require('express');
const app = express();
app.set('views', __dirname + "/views");
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/static'));

app.get('/',(req, res)=>{
    res.render('test');
});

app.post('/',(req, res)=>{
    rainbowSDK.admin.createAnonymousGuestUser()
    .then(result=>{
        var credentials = result;
        res.send({data: credentials});
        res.status(200);
        res.end();
    })
    .catch(err=>{
        res.send({error: err});
        res.status(501);
        res.end();
    })
});

app.listen(80, '0.0.0.0');

// Rainbow Node SDK
// Load the SDK
let RainbowSDK = require("./node_modules/rainbow-node-sdk");
// Load the credentials
let Credentials = require("./static/js/credentials.js");
// Instantiate the SDK
let rainbowSDK = new RainbowSDK(Credentials.cred);
// Start the SDK
rainbowSDK.start();
rainbowSDK.events.on('rainbow_onready', function() {
    // do something when the SDK is connected to Rainbow
    console.log("Rainbow is ready!")
});
rainbowSDK.events.on('rainbow_onerror', function(err) {
    // do something when something goes wrong
    console.error("Something wrong!")
});