var agent_response_count = 0;
var call_request_count = 0;
var mConversation;
var agentInfo;
var intervalEvent;

function waitSeconds(seconds, callback) {
  setTimeout(callback, seconds * 1000);
}

function intervalCallAgent(milliseconds) {
  intervalEvent = setInterval(connectAgent, milliseconds);
}

function stopCallAgent() {
  clearInterval(intervalEvent);
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
  $(identifier).click(function() {
    generateSendBubble($(identifier).html());
    waitSeconds(1, callback);
  });
}

function createResponseMessageForButton(identifier, responseMsg, from, query) {
  $(identifier).click(function() {
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
function createResponseMessageWithChoicesForButton(
  identifier,
  responseMsg,
  from,
  choices
) {
  $(identifier).click(function() {
    generateSendBubble($(identifier).html());
    setTimeout(
      generateResponseBubbleWithInsertionElements.bind(
        this,
        responseMsg,
        from,
        choices
      ),
      1000
    );
  });
}

function createResponseWithAjaxForButton(
  identifier,
  responseMsg,
  from,
  method,
  url,
  data,
  callback
) {
  $(identifier).click(function() {
    generateSendBubble($(identifier).html());
    setTimeout(generateResponseBubble.bind(this, responseMsg, from), 1000);
    createAjax(method, url, data, callback);
  });
}

function createAjax(method, url, data, callback) {
  $.ajax({
    type: method,
    url: url,
    data: data,
    success: callback
  });
}

function scrollToBottom() {
  var element = document.getElementById("conversation_body");
  element.scrollTop = element.scrollHeight;
}

function getPartFromURL(url, index) {
  const mURL = new URL(url);
  var pathName = mURL.pathname;
  var paths = pathName.split("/");
  return paths[index];
}

function getDateTime() {
  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date + " " + time;
  return dateTime;
}

function generateSendBubble(message) {
  var dateTime = getDateTime();
  var name = document.getElementById("settings").innerHTML;
  if (name == "Settings") {
    name = "Guest";
  }
  var bubble = $(`
    <div style="text-align: right">
        <span class="msg_head_send">${name}</span>
        <div>
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
  var name = document.getElementById("settings").innerHTML;
  if (name == "Settings") {
    name = "Guest";
  }
  var bubble = $(`
    <div style="text-align: right">
        <span class="msg_head_send">${name}</span>
        <div>
            <div class="msg_cotainer_send">  
                <span class="msg_body">${message}</span><br>
            </div>
        </div>
        <span class="msg_time_send">${dateTime}</span><span class="msg_disconnect" id="cancel-${call_request_count}">CANCEL CONNECTION</span><br>
    </div>`);
  $("#conversation_body").append(bubble);
  $(`#cancel-${call_request_count}`).click(function() {
    stopCallAgent();
    generateResponseBubble("Connection has been cancelled!", 0);
    waitSeconds(1, generateBotChoicesBubble);
  });
  call_request_count += 1;
  scrollToBottom();
}

function generateResponseBubble(response, from) {
  var dateTime = getDateTime();
  var responseBubble = $(`
    <div>
        <span class="msg_head">${from == 0 ? "Mr. Bot" : "Agent " + from}</span>
        <div>
            <div class="msg_cotainer">  
                <span class="msg_body">${response}</span> 
                <p>Click <img class="agent-icon" src="/icon/agent.png" id="agent-${agent_btn}"> to connect with agents.</p>
            </div>
        </div>
        <span class="msg_time">${dateTime}</span><br>
    </div>`);
  $("#conversation_body").append(responseBubble);
  $(`#agent-${agent_btn}`).click(callAgent);
  agent_btn += 1;
  scrollToBottom();
}

function generateResponseBubbleForAgent(response, from) {
  var dateTime = getDateTime();
  var responseBubble = $(`
    <div>
        <span class="msg_head">${from == 0 ? "Mr. Bot" : "Agent " + from}</span>
        <div>
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

function generateResponseBubbleWithInsertionElements(response, from, elements) {
  var dateTime = getDateTime();
  var responseBubble = $(`
    <div>
        <span class="msg_head">${from == 0 ? "Mr. Bot" : "Agent " + from}</span>
        <div>
            <div class="msg_cotainer">  
                <span class="msg_body">${response}</span><br> 
                ${elements.join("")} 
                <p>Click <img class="agent-icon" src="/icon/agent.png" id="agent-${agent_btn}"> to connect with agents.</p>
            </div>
            
        </div>
        <span class="msg_time">${dateTime}</span>
    </div>`);
  $("#conversation_body").append(responseBubble);
  $(`#agent-${agent_btn}`).click(callAgent);
  agent_btn += 1;
  scrollToBottom();
}

module.exports = { getPartFromURL, getDateTime };
