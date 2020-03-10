// bot ID
const BOT_ID = "5e45ff0fe9f1273063695d17";
const BOT = 0;

// import packages
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
var db = require('./static/js/db.js').dbUtils;
var queries = require('./static/js/queries.js').queries;
var elements = require('./static/js/elementsUtils.js').elementUtils;

// create db collections
db.createUniqueCollection("Users").catch(e=>{console.error(e); process.exit(1);})
db.createUniqueCollection("Agents").catch(e=>{console.error(e); process.exit(1);})

// set up express app
const app = express();

app.set('views', __dirname + "/views");
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/static'));
app.use(session({secret: 'sutd20-alpha~!@',saveUninitialized: true,resave: true}));

// index route GET
app.get('/', (req, res)=>{
    res.render('home');
});

// login POST
app.post('/login', (req,res)=>{
    var username = req.body.username;
    var password = req.body.password;
    //TODO: user verification against database
    var userExist = false;
    var sess = req.session;

    //if exist:
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
app.post('/register', (req, res)=>{
    var data = req.body;
    var username = data.username;
    var password = data.password;
    var firstName = data.firstName;
    var lastName = data.lastName;
    //TODO: Store information into MongoDB
    var userElement = {
        username: username,
        password: password,
        firstName: firstName,
        lastName: lastName
    }
    db.insert(userElement, "Users").then(success=>{
        res.send({success: 1});
        res.status(500);
        res.end();
    }).catch(err=>{
        res.send({error: `Registration failed! ${err}`});
        res.status(500);
        res.end();
    });
});

// logout a bank account
app.get('/logout', (req, res)=>{
    var uid = req.params.uid;
    // TODO: logout the user, switch 
    var sess = req.session;
    sess.LoggedIn = false;
    res.send({success: 1});
    res.status(200);
    res.end();
});

// index route POST -> create guest account -> direct to chat
app.get('/chat',  (req, res) => {
    rainbowSDK.admin.createAnonymousGuestUser()
    .then((result) => {
        var credentials = result;  // this mUser contains credentials needed for login
        res.send({data: credentials});
        res.status(200);
        res.end();
    })
    .catch((err) => {
        console.log(`Create User Error: ${err}`);
        res.status(501);
        res.render('index');
    });
});

// route to receive message data sent from user on chat UI
// and do something about it POST
// currently implemented with bot auto reply
app.post('/chat', (req, res)=>{
    var data = req.body.data;
    var message = req.body.message;
    var replyMsg = `Backend received message: "${message}" from User with ID: ${uid}. Sorry I can't do free chat with you yet :((`; 
    res.send({response: replyMsg, from: BOT});  // 0: bot, 1,2,3... Agent 1,2,3...
    res.status(200);
    res.end();
});

// route to delete user POST
app.get('/delete', function(req, res){
    var uid = req.session.uid;
    if(uid){
        console.log(`User ID to be deleted: ${uid}`);
        db.delete({id: uid}, "Users")
        .then(success=>{
            rainbowSDK.admin.deleteUser(uid).catch(e=>{console.error(e)});
            res.status(200).send({id: uid});
            res.end();
        })
        .catch(e=>{
            console.error("Delete Unsuccessful! " + e);
            res.status(501);
            res.end();
        });
    }
    else{
        res.redirect('/');
    }
});

// route for bot choices response POST
var count0 = 0;
var count1 = 0;
var count2 = 0;
var count3 = 0;
app.post('/bot/choices/:uid', (req, res)=>{
    var uid = req.params.uid;
    var choice = req.body.choice;
    console.log(`Updating for: ${uid}`);
    db.update({id: uid}, {query: choice}, "Users")
    .then(success=>{
        if (choice == queries.GENERAL_ENQUIRY){
            //do something
            var content = "This is an example of General Enquiry response with choices: ";
            var btn0 = elements.generateBtn(`ge${count0*5+0}`, "I don't have a bank account :(", 0);
            var btn1 = elements.generateBtn(`ge${count0*5+1}`, "What is online banking?", 1);
            res.status(200).send({response: {message: content, elements: [btn0, btn1], elementIds: [`ge${count0*5+0}`, `ge${count0*5+1}`]}});
            count0 += 1;
            res.end();
        } else if (choice == queries.CARD_REPLACEMENT){
            //do something
            var content = "This is an example of Card Replacement response";
            res.status(200).send({response: {message: content}});
            res.end();
        } else if (choice == queries.INVESTMENT_LOAN){
            //do something
            var content = "This is an example of Investment and Loan response";
            res.status(200).send({response: {message: content}});
            res.end();
        } else if (choice == queries.OVERSEAS_SPENDING){
            //do something
            var content = "This is an example of Activation of Overseas Spending response";
            res.status(200).send({response: {message: content}});
            res.end();
        } else {
            res.status(500);
            res.json({error: "Invalid choice code: " + choice});
            res.end()
        }
    })
    .catch(e=>{
        console.error(e);
        res.status(500);
        res.json({error: "Failed to update query in DB for user: " + e});
        res.end();
    });
    
    
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
