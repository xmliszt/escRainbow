const db = require('./static/js/db').dbUtils;

var agent1 = {
    name: "Maude Muir",
    skill: 0,
    id: "5e5e23236c332176648fe57e",
    busy: false,
    priority: 0
}

var agent2 = {
    name: "Laurie Kaufman",
    skill: 1,
    id: "5e5e233a6c332176648fe586",
    busy: false,
    priority: 0
}

var agent3 = {
    name: "Michalina Hebert",
    skill: 2,
    id: "5e5e23516c332176648fe58e",
    busy: false,
    priority: 0
}

var agent4 = {
    name: "Zayd Walter",
    skill: 3,
    id: "5e5e23686c332176648fe596",
    busy: false,
    priority: 0
}

db.insert(agent1, "Agents").catch(e=>{console.error(e);});
db.insert(agent2, "Agents").catch(e=>{console.error(e);});
db.insert(agent3, "Agents").catch(e=>{console.error(e);});
db.insert(agent4, "Agents").catch(e=>{console.error(e);});