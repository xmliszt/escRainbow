const db = require('./static/js/db').dbUtils;

db.search({id: "5e5e23236c332176648fe57e"}, "Agents").then(agent=>{
    var priority = agent.priority + 1;
    db.update({id: "5e5e23236c332176648fe57e"}, {busy: false, priority: priority}, "Agents").then(success=>{
        console.log("entry updated!");
    }).catch(err=>{
        console.error(err);
    });
}).catch(err=>{
    console.error(err);
});