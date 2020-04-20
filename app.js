// import packages
// const fs = require("fs");
// const http = require("http");
// const https = require("https");
// const privateKey = fs.readFileSync('./sslcert/privateKey.key', 'utf8');
// const certificate = fs.readFileSync('./sslcert/certificate.crt', 'utf8');
// const appCredentials = {key: privateKey, cert: certificate};


const shield = require("helmet");
const compression = require('compression');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const session = require('express-session');
const rateLimit = require("express-rate-limit");
var cryption = require("simple-crypto-js").default;
const _secretKey = "someSecretAboutAlphaSUTD2020C1G9~!@";
const _secretKey_b = "@#$430dfjasdf012831dafJELJlkfnf1-ijflkn";
var Crypto = new cryption(_secretKey);
var Secret_Crypto = new cryption(_secretKey_b);
const COMPANY_ID = "5e45ff0ee9f1273063695d12";

const limiter = rateLimit({
    windowMs: 1000, // 
    max: 50 // limit each IP to 100 requests per windowMs
  });

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

const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGODB_URI; // production
// const uri = "mongodb+srv://alpha-holding:~!@SUTDsutd123@alpha-cluster-0-ruglw.mongodb.net/test?retryWrites=true";
const dbName = "alphaDB";
var db;
const USERS = "Users";
const AGENTS = "Agents";

MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, async (err, database) => {
    if(err) console.error(err);
    db = await database.db(dbName);
    console.log("Mongo is connected!");
    resetAgents();
    setInterval(resetAgents, 1*24*60*60*1000);
});

async function resetAgents(){
    const agents = await db.collection(AGENTS).find({}).toArray();
    for (var i=0; i<agents.length; i++){
        var agent = agents[i];
        var agentID = agent.id;
        await db.collection(AGENTS).updateOne({id: agentID}, {$set: {priority: 0, busy: false}})
    }
}


// set up express app
const app = express();

app.set('views', __dirname + "/views/ui");
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/static'));
app.use(cookieParser());
app.use("/chat", limiter);
app.use("/connect", limiter);
app.use(shield());
app.use(compression());

app.use((req, res, next) => {
    // Get auth token from the cookies
    const authToken = req.cookies['AuthToken'];
    const authTokenAdmin = req.cookies['AuthTokenAdmin'];
    // Inject the user to the request
    req.user = authTokens[authToken];
    req.admin = authTokens[authTokenAdmin];
    next();
});

// middleware function
const requestAuth = (req, res, next) =>{
    if (req.user){
        next();
    } else {
        res.status(401).send({error: "Unauthenticated access!"});
        res.end();
    }
};

const generateAuthToken = () => {
    return crypto.randomBytes(30).toString('hex');
}

// index route GET
app.get('/', (req, res) => {
    res.clearCookie('AuthTokenAdmin');
    console.log(`Incoming address is: ${
        res.connection.remoteAddress
    }`);
    if (req.user){
        var data = {loggedIn: true, user: req.user};
    } else {
        var data = {loggedIn: false, user: undefined};
    }
    res.render('home', {data: data});
});

app.get('/faq', (req, res) => {
    res.render('faqpage');
})

const authTokens = {};
// login POST
app.post('/login', (req, res) => {
    res.clearCookie('AuthToken');
    var username = req.body.username;
    var password = req.body.password;
    db.collection(USERS).findOne({username: username}).then(user=>{
        var mPass = Crypto.decrypt(user.password);
        if (mPass == password){
            const authToken = generateAuthToken();
            authTokens[authToken] = user;
            res.cookie('AuthToken', authToken);
            res.status(200).send({loggedIn: true, firstName: user.firstName, lastName: user.lastName});
        } else {
            res.status(200).send({loggedIn: false, firstName: undefined, lastName: undefined});
        }
        res.end();
    }).catch(e=>{
        console.log(e);
        res.status(500).send({error: "User not found!"});
        res.end();
    });
});

// register a bank account
app.post('/register', async (req, res) => {
    var data = req.body;
    var username = data.username;
    var password = Crypto.encrypt(data.password);
    var uid = Crypto.encrypt(username);
    var firstName = data.firstName;
    var lastName = data.lastName;
    var user = await db.collection(USERS).findOne({username: username});
    if (user == null){
        // user does not exist
        var userElement = {
            id: uid,
            username: username,
            password: password,
            firstName: firstName,
            lastName: lastName
        }
        db.collection(USERS).insertOne(userElement).then(success => {
            res.status(200).send({success: 1});
            res.end();
        }).catch(err => {
            console.log(err);
            res.status(500).send({error: `Registration failed! ${err}`});
            res.end();
        });
    } else {
        //user exist
        res.status(200).send({success: 2});
        res.end();
    }
});

// logout a bank account
app.get('/logout', (req, res) => {
    res.clearCookie('AuthToken');
    res.status(200).send({success: 1});
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
    db.collection(AGENTS).findOne({id: agentID}).then(agent=>{
        var priority = agent.priority + 1;
        db.collection(AGENTS).updateOne({id: agentID}, {$set: {busy: false, priority: priority}}).then(success=>{
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
app.post('/connect', async (req, res) => {
    var data = req.body;
    var query = data.request;
    var agents = await db.collection(AGENTS).find({skill: Number(query)}).toArray();
    if (agents.length == 0){
        res.status(501).send({error: "No available agent found!"});
        res.end();
        return 1;
    } else {
        // sort agent according to priority scores
        agents.sort((a, b) => (a.priority > b.priority) ? 1 : -1);
        for (var i=0; i<agents.length; i++){
            var agent = agents[i];
            // find a agent not busy
            if(!agent.busy){
                var agentID = agent.id;
                var contact = await rainbowSDK.contacts.getContactById(agentID, true);
                var presence = contact.presence;
                console.log(`${agent.name} presence: ${presence}`);
                // if he is online: connect
                if (presence == "online"){
                    await db.collection(AGENTS).updateOne({id: agentID}, {$set: {busy: true}});
                    console.log(`Agent ${agent.name} is connected! Status updated successfully!`);
                    res.send({info: agent});
                    res.status(200);
                    res.end();
                    return 1;
                }
            }
        }
    }
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

app.get('/auth', (req, res) =>{
    if (req.user){
        res.status(200).send({loggedIn: true, user: req.user});
    } else {
        res.status(401).send({error: "Unauthenticated access!"});
    }
    res.end();
});

app.route('/su')
.post(async (req, res) =>{
    res.clearCookie('AuthTokenAdmin');
    var credential = req.body;
    var username = credential.username;
    var password = credential.password;
    var adminUser = await db.search({username: username}, "Users");
    if (adminUser){
        var DPassword = Secret_Crypto.decrypt(adminUser.password);
        if (password == DPassword){
            const authTokenAdmin = generateAuthToken();
            authTokens[authTokenAdmin] = adminUser;
            res.cookie('AuthTokenAdmin', authTokenAdmin);
            res.status(200).send("Login Successfully!");
        } else {
            res.status(401).send("Incorrect Password");
        }
    } else{
        res.status(401).send("Unknown user!");
    }
    res.end();
}).get((req, res) =>{
    res.clearCookie('AuthTokenAdmin');
    res.render("admin");
});

app.get('/su/dashboard', (req, res) =>{
    if (req.admin){
        res.render("dashboard");
    } else {
        res.status(401).send("Unauthorized access!");
        res.end();
    }
});

app.post('/su/create', async (req, res)=>{
    if (req.admin){
        var agent = req.body;
        var email = agent.email;
        var pwd = agent.password;
        var firstName = agent.firstname;
        var lastName = agent.lastname;
        var skill = Number(agent.skill);
        var found = await db.collection(AGENTS).findOne({email: email});
        if (found != null){
            console.log("Agent already existed!");
            res.status(501).send("Error: Agent already existed!");
        } else {
            try{
                var cred = await rainbowSDK.admin.createUserInCompany(email, pwd, firstName, lastName, COMPANY_ID);
                var agentObject = {
                    name: firstName + " " + lastName,
                    skill: skill,
                    id: cred.id,
                    email: email,
                    busy: false,
                    priority: 0
                }
                await db.collection(AGENTS).insertOne(agentObject);
                console.log("Agent successfully created!");
                await rainbowSDK.invitations.sendInvitationByEmail(email);
                res.status(200).send({agent: agentObject});
            } catch (err) {
                console.log(err)
                console.error("Error: Unable to create agent in RainbowSDK");
                res.status(500).send({error: err});
            }
        }
    } else {
        res.status(401).send("Unauthorized access!");
    }
    res.end();
});


app.get("/su/dashboard/data", async(req, res) => {
    try{
        var arrays = await db.collection(AGENTS).find({});
        res.status(200).send(arrays);
        res.end();
    } catch(err){
        res.status(500).send({error: err});
        res.end();
    }
});

app.get("/su/dashboard/delete", async(req, res) => {
    var agentID = req.query.id;
    try{
        await rainbowSDK.admin.deleteUser(agentID);
        await db.collection(AGENTS).deleteOne({id: agentID});
        res.status(200).send("deleted!");
        res.end();
    } catch (err) {
        res.status(500).send({error: err});
        res.end();
    }
});


// var httpServer = http.createServer(app);
// var httpsServer = https.createServer(appCredentials, app);
module.exports = {app: app};
