// bot ID
const BOT_ID = "5e45ff0fe9f1273063695d17";
const BOT = 0;

// import packages
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
var db = require('./static/js/db.js').dbUtils;
var queries = require('./static/js/queries.js').queries;

// create db collections
db.createUniqueCollection("Users").catch(e => {
    console.error(e);
    process.exit(1);
})
db.createUniqueCollection("Agents").catch(e => {
    console.error(e);
    process.exit(1);
})

// set up express app
const app = express();

app.set('views', __dirname + "/views/ui");
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/static'));
app.use(session({secret: 'sutd20-alpha~!@', saveUninitialized: true, resave: true}));

// index route GET
app.get('/', (req, res) => {
    console.log(`Incoming address is: ${
        res.connection.remoteAddress
    }`);
    res.render('home');
});

// login POST
app.post('/login', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    // TODO: user verification against database
    var userExist = false;
    var sess = req.session;

    // if exist:
    if (userExist) {
        var firstName = "";
        var lastName = "";
        sess.LoggedIn = true;
        res.send({firstName: firstName, lastName: lastName});
        res.status(200);
        res.end();
    } else {
        sess.LoggedIn = false;
        res.send({error: "User not found!"});
        res.status(500);
        res.end();
    }
});

// register a bank account
app.post('/register', (req, res) => {
    var data = req.body;
    var username = data.username;
    var password = data.password;
    var firstName = data.firstName;
    var lastName = data.lastName;
    var userElement = {
        username: username,
        password: password,
        firstName: firstName,
        lastName: lastName
    }
    db.insert(userElement, "Users").then(success => {
        res.send({success: 1});
        res.status(200);
        res.end();
    }).catch(err => {
        res.send({error: `Registration failed! ${err}`});
        res.status(500);
        res.end();
    });
});

// logout a bank account
app.get('/logout', (req, res) => {
    var sess = req.session;
    sess.LoggedIn = false;
    res.send({success: 1});
    res.status(200);
    res.end();
});

// index route POST -> create guest account -> direct to chat
app.get('/chat', (req, res) => {
    rainbowSDK.admin.createAnonymousGuestUser().then((result) => {
        var credentials = result; // this mUser contains credentials needed for login
        res.send({data: credentials});
        res.status(200);
        res.end();
    }).catch((err) => {
        console.log(`Create User Error: ${err}`);
        res.status(501);
        res.render('home');
    });
});

// User selects "chat with agent", backend receive query skill type and user ID (rainbow guest account). Backend queue the request object.
app.post('/request', (req, res) => {
    var id = req.body.id;
    var request = req.body.request;
    // call function for queue
    res.status(200); // success
    res.send({success: 1});
    res.end();
    /*.catch((err) => {
        res.send({error:`Failed to queue the request! ${err}`});
        res.status(501);
        res.render('home');*/
});
// agent connection
app.get('/agent', (req, res) =>{
    // call async function to get availble agent
    // function().then(success=>{
    //     var agentID = success.agentID;
    //     var skill = success.skill;
    //     res.send({agentID: agentID, skill:skill});
    //     res.status(200);
    //     res.end();
    // }).catch(err=>{
    //     res.send({error: "Failed to call agent! " + err});
    //     res.status(501);
    //     res.end();
    // })
});

// check logged in status
app.get('/check', (req, res) => {
    var sess = req.session;
    if (sess.LoggedIn){
        res.send({success: 1});
        res.status(200);
        res.end();
    } else {
        res.send({success: 0});
        res.status(200);
        res.end();
    }
});

// disconnect agent, free his/her busy status
app.post('/disconnect', (req, res) => {
    var data = req.body;
    var agentID = data.agentID;
    db.update({id: agentID}, {busy: false}, "Agents").then(success=>{
        res.status(200).send({id: agentID});
        res.end();
    }).catch(err=>{
        res.status(501).send({error: "Failed to update agent" + err});
        res.end();
    });
});

// test route for connecting an available agent to chat
app.post('/connect', (req, res) => {
    var data = req.body;
    var query = data.request;
    var found = false;
    console.log(`Query: ${query}`);
    db.findAll({skill: Number(query)}, "Agents").then(agents=>{
        console.log(agents);
        if (agents.length == 0){
            res.status(501).send({error: "No available agent found!"});
            res.end();
        } else {
            for (var i=0; i<agents.length; i++){
                var agent = agents[i];
                if(!agent.busy){
                    var agentID = agent.id;
                    found = true;
                    db.update({id: agentID}, {busy: true}, "Agents").then(success=>{
                        console.log(`Agent ${agent.name} is connected! Status updated successfully!`);
                        res.send({info: agent});
                        res.status(200);
                        res.end();
                    });
                    break;
                }
            }
            if (found == false){
                console.log("Not found!")
                res.status(501).send({error: "No available agent found!"});
                res.end();
            }
        }
    }).catch(err=>{
        res.send({error: err});
        res.status(500);
        res.end();
    })
});

// user make loan appointment - need to check login status
app.get('/loan', (res, req) => {
    var sess = req.session;
    if (sess.LoggedIn == true) {
        res.send({success: true});
        res.status(200);
        res.end();
    } else {
        res.send({success: false});
        res.status(200);
        res.end();
    }
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
rainbowSDK.events.on('rainbow_onready', function () { // do something when the SDK is connected to Rainbow
    console.log("Rainbow is ready!")
});
rainbowSDK.events.on('rainbow_onerror', function (err) { // do something when something goes wrong
    console.error("Something wrong!")
});

// bot auto reply
// when receive message
// rainbowSDK.events.on('rainbow_onmessagereceived', (message) => {
//     // Check if the message comes from a user
//     if(message.type === "chat") {
//         // Do something with the message
//         rainbowSDK.im.sendMessageToJid(`I receive the message "${message.content}" from User with ID: ${message.fromJid}`, message.fromJid);
//     } else if(message.type === "groupchat"){
//         rainbowSDK.im.sendMessageToBubbleJid(`I receive the message "${message.content}" from User with ID: ${message.fromBubbleUserJid}`, message.fromBubbleJid);
//     }
// });
