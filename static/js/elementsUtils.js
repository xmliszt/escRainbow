import {disconnect, callAgent} from "./../js/agentConnUtils.js";
import {current_query, generateBotChoicesBubble} from "./../js/chatBotChoice.js";


var agent_response_count = 0;
var call_request_count = 0;
var timeoutEvent;
var timeoutEvent2;
var agent_btn = 0;


function waitSeconds(seconds, callback) {
    setTimeout(callback, seconds * 1000);
}

function cancelAgentCall(){
    stopTimeOutEvent();
    disconnect();
    generateResponseBubble("Connection to agents has been terminated! Please try again!", 0);
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

function generateButton(id, content, btn_value) {
    var element = `<button class="btn btn-sm btn-dark" style="margin: 5" id="${id}" value="${btn_value}">${content}</button>`;
    return element;
}

/**
 *
 * @param {String} response response text
 * @param {Integer} from 0: bot, 1,2,3...: Agent 1,2,3...
 * @param {Array[String]} elements array of elements as string to be inserted
 */

function createCallbackResponseForButton(identifier, callback) {
    $(identifier).click(function () {
        generateSendBubble($(identifier).html());
        waitSeconds(1, callback);
    });
}

function createResponseMessageForButton(identifier, responseMsg, from, query) {
    $(identifier).click(function () {
        generateSendBubble($(identifier).html());
        setTimeout(generateResponseBubble.bind(this, responseMsg, from), 1000);
        current_query = query;
        console.log("Query set to " + current_query);
    });
}

/**
 *
 * @param {Array[String]} choices Array of string of button elements
 */
function createResponseMessageWithChoicesForButton(identifier, responseMsg, from, choices) {
    $(identifier).click(function () {
        generateSendBubble($(identifier).html());
        setTimeout(generateResponseBubbleWithInsertionElements.bind(this, responseMsg, from, choices), 1000);
    });
}

function createResponseWithAjaxForButton(identifier, responseMsg, from, method, url, data, callback) {
    $(identifier).click(function () {
        generateSendBubble($(identifier).html());
        setTimeout(generateResponseBubble.bind(this, responseMsg, from), 1000);
        createAjax(method, url, data, callback);
    });
}

function createAjax(method, url, data, callback) {
    $.ajax({type: method, url: url, data: data, success: callback});
}

function scrollToBottom() {
    var element = document.getElementById("conversation_body");
    element.scrollTop = element.scrollHeight;
}

function getDateTime() {
    var today = new Date();
    var date = today.getFullYear() + "-" + (
        today.getMonth() + 1
    ) + "-" + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + " " + time;
    return dateTime;
}

function generateSendBubble(message) {
    var dateTime = getDateTime();
    var name = document.getElementById("titleText").innerHTML;
    if (name == "ALPHA"){
        name = "Guest";
    }
    var bubble = $(`
    <div style="text-align: right">
        <span class="msg_head_send">${name}</span>
        <div style="display: flex; justify-content: flex-end;">
            <div class="msg_cotainer_send">  
                <span class="msg_body">${message}</span><br>
            </div>
        </div>
        <span class="msg_time_send">${dateTime}</span>
    </div>`);
    $("#conversation_body").append(bubble);
    scrollToBottom();
}

function generateSendBubbleConnectingAgent(message) {
    var dateTime = getDateTime();
    var name = document.getElementById("titleText").innerHTML;
    if (name == "ALPHA"){
        name = "Guest";
    }
    var bubble = $(`
    <div style="text-align: right">
        <span class="msg_head_send">${name}</span>
        <div style="display: flex; justify-content: flex-end;">
            <div class="msg_cotainer_send">  
                <span class="msg_body">${message}</span><br>
            </div>
        </div>
        <span class="msg_time_send">${dateTime}</span><span class="msg_disconnect" id="cancel-${call_request_count}">CANCEL CONNECTION</span><br>
    </div>`);
    $('#conversation_body').append(bubble);
    $(`#cancel-${call_request_count}`).click(function(){
        cancelAgentCall();
        waitSeconds(1, generateBotChoicesBubble);
    });
    call_request_count += 1;
    scrollToBottom();
}

function generateResponseBubble(response, from, agentBtn=true) {
    var dateTime = getDateTime();
    if (agentBtn){
        var responseBubble = $(`
        <div>
            <span class="msg_head">${
            from == 0 ? "Mr. Bot" : "Agent " + from
        }</span>
            <div style="display: flex; justify-content: flex-start;">
                <div class="msg_cotainer">  
                    <span class="msg_body">${response}</span> 
                    <p style="color: #4065a1; font-size: 10px; margin-top: 8px">Click <img class="agent-icon" src="/icon/agent.png" id="agent-1-${agent_btn}"> to connect with agents.</p>
                </div>
            </div>
            <span class="msg_time">${dateTime}</span><br>
        </div>`);
    } else {
        var responseBubble = $(`
        <div>
            <span class="msg_head">${
            from == 0 ? "Mr. Bot" : "Agent " + from
        }</span>
            <div style="display: flex; justify-content: flex-start;">
                <div class="msg_cotainer">  
                    <span class="msg_body">${response}</span> 
                </div>
            </div>
            <span class="msg_time">${dateTime}</span><br>
        </div>`);
    }
    $("#conversation_body").append(responseBubble);
    $(`#agent-1-${agent_btn}`).click(callAgent);
    agent_btn += 1;

    scrollToBottom();
}

function generateConnectionReminderBubble(response, from){
    var dateTime = getDateTime();
    var responseBubble = $(`
    <div>
        <span class="msg_head">${from==0 ? "Mr. Bot" : "Agent "+from}</span>
        <div style="display: flex; justify-content: flex-start;">
            <div class="msg_cotainer">  
                <span class="msg_body">${response}</span> 
            </div>
        </div>
        <span class="msg_time_send">${dateTime}</span><span class="msg_disconnect" id="cancel-${call_request_count}">CANCEL CONNECTION</span><br>
    </div>`);
    $('#conversation_body').append(responseBubble);
    $(`#cancel-${call_request_count}`).click(function(){
        cancelAgentCall();
        waitSeconds(1, generateBotChoicesBubble);
    });
    call_request_count += 1;
    scrollToBottom();
}

function generateResponseBubbleForAgent(response, from){
    var dateTime = getDateTime();
    var responseBubble = $(`
    <div>
        <span class="msg_head">${
        from == 0 ? "Mr. Bot" : "Agent " + from
    }</span>
        <div style="display: flex; justify-content: flex-start;">
            <div class="msg_cotainer">  
                <span class="msg_body">${response}</span>
            </div>
        </div>
        <span class="msg_time">${dateTime}</span><span class="msg_disconnect" id="disconnect-${agent_response_count}"> DISCONNECT</span><br>
    </div>`);
    $("#conversation_body").append(responseBubble);
    $(`#disconnect-${agent_response_count}`).click(disconnect);
    agent_response_count += 1;
    scrollToBottom();
}

function generateResponseBubbleWithInsertionElements(response, from, elements, agentBtn=true) {
    var dateTime = getDateTime();
    if (agentBtn){
        var responseBubble = $(`
        <div>
            <span class="msg_head">${
            from == 0 ? "Mr. Bot" : "Agent " + from
        }</span>
            <div style="display: flex; justify-content: flex-start;">
                <div class="msg_cotainer">  
                    <span class="msg_body">${response}</span><br> 
                    ${elements.join("")} 
                    <p style="color: #4065a1; font-size: 10px; margin-top: 8px">Click <img class="agent-icon" src="/icon/agent.png" id="agent-2-${agent_btn}"> to connect with agents.</p>
                </div>
                
            </div>
            <span class="msg_time">${dateTime}</span>
        </div>`);

    } else {
        var responseBubble = $(`
        <div>
            <span class="msg_head">${
            from == 0 ? "Mr. Bot" : "Agent " + from
        }</span>
            <div style="display: flex; justify-content: flex-start;">
                <div class="msg_cotainer">  
                    <span class="msg_body">${response}</span><br> 
                    ${elements.join("")} 
                </div>
                
            </div>
            <span class="msg_time">${dateTime}</span>
        </div>`);
    }
    $("#conversation_body").append(responseBubble);
    $(`#agent-2-${agent_btn}`).click(callAgent);
    agent_btn += 1;
    scrollToBottom();
}

export {
    stopTimeOutEvent, 
    generateConnectionReminderBubble,
    generateResponseBubble,
    generateResponseBubbleForAgent,
    generateResponseBubbleWithInsertionElements,
    generateSendBubble,
    generateSendBubbleConnectingAgent,
    startTimeOutForDisconnection,
    startTimeOutForReminder,
    startTimeOutForTerminateCallAgent,
    getDateTime,
    scrollToBottom,
    createCallbackResponseForButton,
    createResponseMessageForButton,
    createResponseMessageWithChoicesForButton,
    createResponseWithAjaxForButton,
    generateButton,
    createAjax,
    waitSeconds
};