import {disconnect} from "./../js/agentConnUtils.js";
import {generateConnectionReminderBubble, generateResponseBubbleForAgent, cancelAgentCall} from "./../js/bubbleGenerator.js";

var timeoutEvent;
var timeoutEvent2;

function waitSeconds(seconds, callback) {
    setTimeout(callback, seconds * 1000);
}

function startTimeOutForReminder(minutes){
    timeoutEvent = setTimeout(sendReminderForInactivity, minutes*60*1000);
}

function stopTimeOutEvent(){
    clearTimeout(timeoutEvent);
    clearTimeout(timeoutEvent2);
}

function startTimeOutForDisconnection(minutes){
    timeoutEvent = setTimeout(disconnect, minutes*60*1000);
}

function startTimeOutForTerminateCallAgent(minutes){
    timeoutEvent2 = setTimeout(generateConnectionReminderBubble.bind(this, "All our agents are still busy, we are still trying out best to connect you... [The connection will be auto terminated after 30 seconds]", 0), 0.5*60*1000);
    timeoutEvent = setTimeout(cancelAgentCall, minutes*60*1000);
}

function sendReminderForInactivity(){
    generateResponseBubbleForAgent("Hey there! This chat will close automatically if no activity is detected in the next 2 minutes. Should you have any further queries, feel free to start a new chat with our friendly Agents later! Thank you and have a nice day (:", 0);
    stopTimeOutEvent();
    startTimeOutForDisconnection(2);
}



export {waitSeconds, startTimeOutForDisconnection, startTimeOutForReminder, startTimeOutForTerminateCallAgent, stopTimeOutEvent, sendReminderForInactivity};