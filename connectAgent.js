var db = require('./static/js/db.js').dbUtils;
const query = require("./static/js/queries").queries;
const queue = require("./static/js/queue");
const req = require("./static/js/request");

db.createUniqueCollection("Agents").catch(e=>{console.error(e); process.exit(1);})


const cardReplacementQueue = new queue.Queue();

const R1 = new req.Request("001", query.CARD_REPLACEMENT);
const R2 = new req.Request("002", query.CARD_REPLACEMENT);

cardReplacementQueue.enqueue(R1);
console.log(cardReplacementQueue.toString());
cardReplacementQueue.enqueue(R2);
console.log(cardReplacementQueue.toString());

db.insert({
    id: "101",
    skillsets: [query.CARD_REPLACEMENT, query.GENERAL_ENQUIRY],
    busy: true
}, "Agents");

db.insert({
    id: "102",
    skillsets: [query.CARD_REPLACEMENT, query.GENERAL_ENQUIRY],
    busy: false
}, "Agents");

db.insert({
    id: "103",
    skillsets: [query.CARD_REPLACEMENT],
    busy: false
}, "Agents");

/**
 * TODO
 * create queue for agent
 * when first available agent is assigned to chat, remove agent from queue
 * after said agent closes chat, queue him back at bottom
 */

 /**
  * QUESTIONS
  * how to identify the agent
  * how to queue the agents
  * in the mongodb community, is it technically considered an array already?
  * 
  */

  //const A1 = new agent.Agent ("101", query.CARD_REPLACEMENT)
  //agentQueue.enqueue();


db.search({skillsets: query.CARD_REPLACEMENT} && {busy: false},"Agents").then(result=>{

    //assign available agent to chat
    //remove request from request queue after assigned to agent
    cardReplacementQueue.dequeue();
    //agentQueue.dequeue();
    console.log(cardReplacementQueue.toString());

}).catch(err=>{
    console.error(`Failed to find agent: ${err}`);
    console.log("Sorry, our Agents are currently unavailable, please try again later ):");
    console.log(cardReplacementQueue.toString());
});











