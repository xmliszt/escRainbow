var db = require('./static/js/db.js').dbUtils;
var queries = require('./static/js/queries.js').queries;

db.createUniqueCollection("Users")
.then(function(result){
    console.log("Success: " + result);
}).catch(function(err){
    console.error("Failed to create collection: " + err);
});

v1 = {
    id: "001",
    firstName: "Hi",
    lastName: "Yay",
    credentials: new Object({name: "li"}),
    query: undefined
}

v2 = {
    id: "a01",
    firstName: "Yuxuan",
    lastName: "Bot",
    skillsets: [],
    email: "123@gmail.com",
    credentials: new Object({name: "agent"}),
    busy: false
}

var update1 = {firstName: "update", lastName: "什么", query: queries.GENERAL_ENQUIRY};
db.update({id: "001"}, update1, "Users").catch(e=>{console.error("Failed to update: " + e)});
var found = undefined;
db.search({id: "001"}, "Users").then(result=>{found=result; console.log(found);}).catch(e=>{console.error("Failed to find entry!" + e)});
