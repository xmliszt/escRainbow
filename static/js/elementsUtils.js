function waitSeconds(seconds, callback){
    setTimeout(callback, seconds*1000);
}

function generateButton(id, content, btn_value){
    var element = 
        `<button class="btn btn-sm btn-dark" style="margin: 5" id="${id}" value="${btn_value}">${content}</button>`
    ;
    return element;
}

/**
 * 
 * @param {String} response response text
 * @param {Integer} from 0: bot, 1,2,3...: Agent 1,2,3...
 * @param {Array[String]} elements array of elements as string to be inserted
 */


function createCallbackResponseForButton(identifier, callback){
    $(identifier).click(function(){
        generateSendBubble($(identifier).html());
        waitSeconds(1, callback);
    });
}

function createResponseMessageForButton(identifier, responseMsg, from, query){
    $(identifier).click(function(){
        generateSendBubble($(identifier).html());
        setTimeout(generateResponseBubble.bind(this, responseMsg, from),1000);
        current_query = query;
        console.log("Query set to " + current_query);
    });
}

/**
 * 
 * @param {Array[String]} choices Array of string of button elements
 */
function createResponseMessageWithChoicesForButton(identifier, responseMsg, from, choices){
    $(identifier).click(function(){
        generateSendBubble($(identifier).html());
        setTimeout(generateResponseBubbleWithInsertionElements.bind(this, responseMsg, from, choices), 1000);
    });
}

function createResponseWithAjaxForButton(identifier, responseMsg, from, method, url, data, callback){
    $(identifier).click(function(){
        generateSendBubble($(identifier).html());
        setTimeout(generateResponseBubble.bind(this, responseMsg, from), 1000);
        createAjax(method, url, data, callback);
    });
}

function createAjax(method,url,data,callback){
    $.ajax({
        type: method,
        url: url,
        data: data,
        success: callback
    });
}

function scrollToBottom(){
    var element = document.getElementById("conversation_body");
    element.scrollTop = element.scrollHeight;
}

function getPartFromURL(url, index){
    const mURL = new URL(url);
    var pathName = mURL.pathname;
    var paths = pathName.split("/");
    return paths[index];
}

function getDateTime(){
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    return dateTime;
}

function generateSendBubble(message){
    var dateTime = getDateTime();
    var fName = document.getElementById("fName").innerHTML;
    var lName = document.getElementById("lName").innerHTML;
    var bubble = $(`
    <div style="text-align: right">
        <span class="msg_head_send">${fName} ${lName}</span>
        <div>
            <div class="msg_cotainer_send">  
                <span class="msg_body">${message}</span><br>
            </div>
        </div>
        <span class="msg_time_send">${dateTime}</span>
    </div>`);
    $('#conversation_body').append(bubble);
    scrollToBottom();
}

function generateResponseBubble(response, from){
    var dateTime = getDateTime();
    var responseBubble = $(`
    <div>
        <span class="msg_head">${from==0 ? "Mr. Bot" : "Agent "+from}</span>
        <div>
            <div class="msg_cotainer">  
                <span class="msg_body">${response}</span>
                <img class="agent-icon" src="/icon/agent.png" id="agent-${agent_btn}">
            </div>
        </div>
        <span class="msg_time">${dateTime}</span><br>
    </div>`);
    $('#conversation_body').append(responseBubble);
    $(`#agent-${agent_btn}`).click(callAgent);
    agent_btn += 1;
    scrollToBottom();
}

function generateResponseBubbleWithoutAgentBtn(response, from){
    var dateTime = getDateTime();
    var responseBubble = $(`
    <div>
        <span class="msg_head">${from==0 ? "Mr. Bot" : "Agent "+from}</span>
        <div>
            <div class="msg_cotainer">  
                <span class="msg_body">${response}</span>
            </div>
        </div>
        <span class="msg_time">${dateTime}</span><br>
    </div>`);
    $('#conversation_body').append(responseBubble);
    scrollToBottom();
}

function generateResponseBubbleWithInsertionElements(response, from, elements){
    var dateTime = getDateTime();
    var responseBubble = $(`
    <div>
        <span class="msg_head">${from==0 ? "Mr. Bot" : "Agent "+from}</span>
        <div>
            <div class="msg_cotainer">  
                <span class="msg_body">${response}</span><br> 
                ${elements.join("")} 
                <img class="agent-icon" src="/icon/agent.png" id="agent-${agent_btn}">
            </div>
        </div>
        <span class="msg_time">${dateTime}</span>
    </div>`);
    $('#conversation_body').append(responseBubble);
    $(`#agent-${agent_btn}`).click(callAgent);
    agent_btn += 1;
    scrollToBottom();   
}


function sendRequest(){
// AJAX POST to /request
}

function getAgent(){
// AJAX GET to /agent
}

// simple version:  function for agent routing
async function connectAgent(){
    $.ajax({
        url: '/connect',
        data: {request: current_query},
        type: "POST",
        success: function(data, status, els){
            console.log("Connect to agent successfully!");
            var agentInfo = data.info;
            console.log(agentInfo);
            rainbowSDK.contacts.searchById(agentInfo.id).then(contact=>{
                console.log("Agent found: " + contact.firstname); 
                rainbowSDK.conversations.openConversationForContact(contact).then(conversation=>{
                    generateResponseBubbleWithoutAgentBtn(`You are connected to agent: ${agentInfo.name}. ID: ${agentInfo.id}`, 0);
                    $("form").submit(function(e) {
                        console.log("New function for form! :" + message);
                        rainbowSDK.im.sendMessageToConversation(conversation, message);
                    });
                    }).catch(err=>{
                        console.error("Failed to open conversation! "+ err);
                    });
            }).catch(err=>{console.error("Failed to find agent: " + err)});
        },
        error: function(error, status, els){
            if (error.status == 501){
                console.log(error.responseJSON.error);
                generateResponseBubble("Sorry we cannot find an available agent now! Please come back later!", 0);
            }
        }
    });
}

function callAgent(){
    generateSendBubble("Connecting to available agent...");
    // create Anonymous account to get credentials
    $.ajax({
        url: '/chat',
        type: 'GET',
        success: function(data, status, els){
            var email = data.data.loginEmail;
            var pwd = data.data.password;
            rainbowSDK.connection.signin(email, pwd).then(success=>{
                connectAgent();
            }).catch(err =>{
                console.error("Failed to sign in guest account!");
                generateResponseBubble("Connection refused. Please try again!", 0);
            });
        }
    });
}