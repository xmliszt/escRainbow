// bot ID
const BOT_ID = "5e45ff0fe9f1273063695d17";
const BOT = 0;

// import packages
const express = require('express');
const hash = require('./static/js/hash');
const bodyParser = require('body-parser');
const session = require('express-session');
var db = require('./static/js/db.js').dbUtils;
var queries = require('./static/js/queries.js').queries;

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
app.get('/', function(req, res){
    res.render('index');
});

// index route POST -> create guest account -> direct to chat
app.post('/',  (req, res) => {
    var firstName = req.body.firstN;
    var lastName = req.body.lastN;
    rainbowSDK.admin.createGuestUser(firstName, lastName)
    .then((result) => {
        var mUser = result;  // this mUser contains credentials needed for login
        var userValues = {
            id: mUser.id,
            firstName: mUser.firstName,
            lastName: mUser.lastName,
            credentials: result,
            query: undefined
        };
        sess = req.session;
        sess.uid = mUser.id;
        sess.fName = mUser.firstName;
        sess.lName = mUser.lastName;
        db.insert(userValues, "Users").catch(e=>{console.error("Failed to insert entry into Users! " + e)});
        console.log(`Create New Guest User: ${mUser.id}\t`);
        res.redirect(`/chat/${mUser.id}`);
    })
    .catch((err) => {
        console.log(`Create User Error: ${err}`);
        res.render('index');
    });
});

// route to display chat UI for a particular user GET
app.get('/chat/:uid', (req, res)=>{
    var uid = req.params.uid;
    db.search({id: uid}, "Users").then(usr=>{
        console.log(`Found a user in MongoDB: ID ${usr.id} firstName ${usr.firstName} lastName ${usr.lastName} query ${usr.query}`);
        var sess = req.session;
        res.render('chat', sess);
    }).catch(e=>{
        console.error(`Failed to find user with id: ${mUser.id} [${e}]`);
        res.redirect('/');
    });
});

// route to receive message data sent from user on chat UI
// and do something about it POST
// currently implemented with bot auto reply
app.post('/chat/:uid', (req, res)=>{
    var uid = req.params.uid;
    var message = req.body.message;
    var replyMsg = `I receive the message "${message}" from User with ID: ${uid}`; 
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


app.listen(8887);

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
