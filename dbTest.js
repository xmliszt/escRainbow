const db = require('./static/js/db').dbUtils;

db.findAll({skill: 0}, "Agents").then(results=>{
    console.log(results[0]);
}).catch(err =>{
    console.error(err);
})