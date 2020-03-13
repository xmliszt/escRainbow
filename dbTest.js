const db = require('./static/js/db').dbUtils;

db.findAll({skill: 0}, "Agents").then(results=>{
    console.log(results.length);
}).catch(err =>{
    console.error(err);
})