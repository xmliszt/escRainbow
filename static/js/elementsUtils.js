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
function generateResponseBubbleWithInsertionElements(response, from, elements){
    var dateTime = getDateTime();
    var responseBubble = $(`
    <div>
        <span class="msg_head">${from==0 ? "Mr. Bot" : "Agent "+from}</span>
        <div>
            <div class="msg_cotainer">  
                <span class="msg_body">${response}</span><br> 
                ${elements.join("<br>")} 
            </div>
        </div>
        <span class="msg_time">${dateTime}</span>
    </div>`);
    $('#conversation_body').append(responseBubble);
    scrollToBottom();   
}

function createCallbackResponseForButton(identifier, callback){
    $(identifier).click(callback);
}

function createResponseMessageForButton(identifier, responseMsg, from){
    $(identifier).click(function(){
        generateSendBubble($(identifier).html());
        setTimeout(generateResponseBubble(responseMsg, from),1000);
    });
}

/**
 * 
 * @param {Array[String]} choices Array of string of button elements
 */
function createResponseMessageWithChoicesForButton(identifier, responseMsg, from, choices){
    $(identifier).click(function(){
        generateSendBubble($(identifier).html());
        setTimeout(generateResponseBubbleWithInsertionElements(responseMsg, from, choices), 1000);
    });
}

function createResponseWithAjaxForButton(identifier, responseMsg, from, method, url, data, callback){
    $(identifier).click(function(){
        generateSendBubble($(identifier).html());
        setTimeout(generateResponseBubble(responseMsg, from), 1000);
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
                <span class="msg_body">${response}</span><br>
            </div>
        </div>
        <span class="msg_time">${dateTime}</span>
    </div>`);
    $('#conversation_body').append(responseBubble);
    scrollToBottom();
}
