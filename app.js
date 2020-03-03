// Building web server
const express = require('express');
const hash = require('./static/js/hash');
const bodyParser = require('body-parser');
const app = express();
app.set('views', __dirname + "/views");
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/static'));


// index route GET
app.get('/', function(req, res){
    res.render('index');
});

app.post('/', function(req, res){
    var firstName = req.body.firstN;
    var lastName = req.body.lastN;
    rainbowSDK.admin.createGuestUser(firstName, lastName)
    .then((user) => {
        console.log(`Create New Guest User: ${user.id}\tName: ${user.firstname} ${user.lastname}`);
    })
    .catch((err) => {
        console.log(`Create User Error: ${err}`);
    });

    res.redirect(`/chat?uid=${hash.hash(firstName+":"+lastName)}`);
});

// chat route GET
app.get('/chat', function(req, res){
    var uid = req.query.uid;
    uid = hash.rehash(uid);
    var firstName = uid.split(":")[0];
    var lastName = uid.split(":")[1];
    console.log(firstName + " " + lastName);
    res.render('chat', {firstName: firstName, lastName: lastName});
});

app.listen(8887);

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


// when receive message
rainbowSDK.events.on('rainbow_onmessagereceived', (message) => {
    // Check if the message comes from a user
    if(message.type === "chat") {
        // Do something with the message      
        rainbowSDK.im.sendMessageToJid(`I receive the message "${message.content}" from User with ID: ${message.fromJid}`, message.fromJid); 
    } else if(message.type === "groupchat"){
        rainbowSDK.im.sendMessageToBubbleJid(`I receive the message "${message.content}" from User with ID: ${message.fromBubbleUserJid}`, message.fromBubbleJid);
    }
});
