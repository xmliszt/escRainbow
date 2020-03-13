// import packages
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const rateLimit = require("express-rate-limit");
var db = require('./static/js/db.js').dbUtils;
var queries = require('./static/js/queries.js').queries;

const limiter = rateLimit({
    windowMs: 1000, // 
    max: 50 // limit each IP to 100 requests per windowMs
  });

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
app.use("/chat", limiter);
app.use("/connect", limiter);

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

// disconnect agent, free his/her busy status
app.post('/disconnect', (req, res) => {
    var data = req.body;
    var agentID = data.agentID;
    db.search({id: agentID}, "Agents").then(agent=>{
        var priority = agent.priority + 1;
        db.update({id: agentID}, {busy: false, priority: priority}, "Agents").then(success=>{
            res.status(200).send({id: agentID});
            res.end();
        }).catch(err=>{
            res.status(501).send({error: "Failed to update agent" + err});
            res.end();
        });
    }).catch(err=>{
        res.status(501).send({error: "Failed to find agent" + err});
        res.end();
    });
});

// connecting an available agent to chat
app.post('/connect', (req, res) => {
    var data = req.body;
    var query = data.request;
    var found = false;
    db.findAll({skill: Number(query)}, "Agents").then(agents=>{
        if (agents.length == 0){
            res.status(501).send({error: "No available agent found!"});
            res.end();
        } else {
            // sort agent according to priority scores
            agents.sort((a, b) => (a.priority > b.priority) ? 1 : -1);
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
