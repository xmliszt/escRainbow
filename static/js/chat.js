var cloneCount = 0;

$(document).ready(function(){

    generateBotChoicesBubble();
    $('form').submit(function(e){
        e.preventDefault();
        // append chat message bubble
        var message = $('#userInputMsg').val();
        generateSendBubble(message);
        document.getElementById("userInputMsg").value = "";

        if (message.toLowerCase() == "help"){
            generateBotChoicesBubble();
            return;
        } else {
            // send message to backend to be sent to rainbow service and get a response message back
            createAjax("POST", window.location.href, {message:message}, function(data, status, els){
                console.log(`${status}: Receive response: ${data.response}`);
                var responseMsg = data.response.toString();
                var responseBody = data.from;
                console.log(`${responseMsg} ${responseBody}`);
                setTimeout(function(){generateResponseBubble(responseMsg, responseBody);}, 1000);
            });
            return;
        }
    });

    $('#quit').click(function(){
        var decision = confirm("You are in Guest mode. Exit will erase all dialogue history.")
        if(decision){
            createAjax("GET", '/delete', {}, function(data, status, els){
                console.log(`${status}: ${data.id} has been deleted successfully!`);
                window.location.href = "/";
            });
        } else {
            return false;
        }
    });
});

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

function generateBotChoicesBubble(){
    var dateTime = getDateTime();
    var responseBubble = $(`
    <div>
        <span class="msg_head">Mr. Bot</span>
        <div>
            <div class="msg_cotainer">  
                <span class="msg_body">Hi! Welcome to Alpha banking services. Select an option to start!</span><br>
                <button class="q0 btn btn-sm btn-dark" id="${cloneCount*5+0}">General Enqueries</button>
                <button class="q1 btn btn-sm btn-dark" id="${cloneCount*5+1}">Card Replacement</button>
                <button class="q2 btn btn-sm btn-dark" id="${cloneCount*5+2}">Investment/Loan</button>
                <button class="q3 btn btn-sm btn-dark" id="${cloneCount*5+3}">Overseas Spending Activation</button>
                <button class="q4 btn btn-sm btn-success" id="${cloneCount*5+4}">Chat With Agents</button><br>
                <span class="msg_body">Type <b>"help"</b> to bring up the choices again.</span>
            </div>
        </div>
        <span class="msg_time">${dateTime}</span>
    </div>`);
    $('#conversation_body').append(responseBubble);
    scrollToBottom();

    var handleBotChoiceURL = `/bot/choices/${getPartFromURL(window.location.href,2)}`;
    console.log(handleBotChoiceURL);

    createResponseWithAjaxForButton(`#${cloneCount*5+0}`, "You selected General Enqueries", 0, "POST", handleBotChoiceURL, {choice:0}, function(data, status, els){
        var response = data.response.message;
        var elements = data.response.elements;
        var elementIds = data.response.elementIds;
        console.log(`data: ${data.response.elementIds}`);
        generateResponseBubbleWithInsertionElements(response, 0, elements);
        createResponseMessageForButton(`#${elementIds[0]}`, "Go create one :)))");
        createResponseMessageForButton(`#${elementIds[1]}`, "It is doing bank stuff on the Internet");
     });

    createResponseWithAjaxForButton(`#${cloneCount*5+1}`, "You selected Card Replacement", 0, "POST", handleBotChoiceURL, {choice:1}, function(data, status, elf){
        var response = data.response.message;
        generateResponseBubble(response, 0);
    });

    createResponseWithAjaxForButton(`#${cloneCount*5+2}`, "You selected Investment/Loan", 0, "POST", handleBotChoiceURL, {choice:2}, function(data, status,els){
        var response = data.response.message;
        generateResponseBubble(response, 0);
    });

    createResponseWithAjaxForButton(`#${cloneCount*5+3}`, "You selected Overseas Spending Activation", 0, "POST", handleBotChoiceURL, {choice:3}, function(data, status,els){
        var response = data.response.message;
        generateResponseBubble(response, 0);
    });

    $(`#${cloneCount*5+4}`).click(function(){
        generateSendBubble(this.innerHTML);
        // TODO: send request to backend to connect to an available agent!! IMPORTANT!! ROUTING ENGINE FEATURES!
        setTimeout(function(){
            generateResponseBubble("Our agent routing engine is still under development! Sorry for the inconvenience caused!", 0);
        }, 1000);
        setTimeout(function(){generateBotChoicesBubble();}, 2000);
    });

    cloneCount += 1;
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