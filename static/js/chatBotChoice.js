var current_query = 0;
var agent_btn = 0;

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
                <span class="msg_body">Type <b>"help"</b> to bring up the choices again.</span>
            </div>
        </div>
        <span class="msg_time">${dateTime}</span>
    </div>`);
    $('#conversation_body').append(responseBubble);
    scrollToBottom();
    
    // Sub response for GENERAL ENQUERIES
    createCallbackResponseForButton(`#${cloneCount*5+0}`, function(){
        var elements = [
            generateButton(`ge-${cloneCount*5+0}`, "I don't know how to create a bank account :(", 0),
            generateButton(`ge-${cloneCount*5+1}`, "what?", 1),
            generateButton(`ge-${cloneCount*5+2}`, "Hello", 2)
        ];
        generateResponseBubbleWithInsertionElements("You selected general enqueries: ", 0, elements);
        createResponseMessageForButton(`#ge-${cloneCount*5+0}`, "Go create one :)))");
        createResponseMessageForButton(`#ge-${cloneCount*5+1}`, "It is doing bank stuff on the Internet");
        createCallbackResponseForButton(`#ge-${cloneCount*5+2}`, function(){
            generateResponseBubbleWithInsertionElements("Hello more choices: ", 0, [generateButton(`ge-sub-${cloneCount*5+0}`, "woah", 0)]);
            createResponseMessageForButton(`#ge-sub-${cloneCount*5+0}`, "you found me!");
        });
        current_query = 0;
        console.log("Query set to 0");
     });

     // Sub response for CARD REPLACEMENT
    createResponseMessageForButton(`#${cloneCount*5+1}`, "Card replacement information", 0, 1);

    // Sub response for 
    createResponseMessageForButton(`#${cloneCount*5+2}`, "You selected Investment/Loan", 0, 2);
    
    //
    createResponseMessageForButton(`#${cloneCount*5+3}`, "You selected Overseas Spending Activation", 0, 3);

    cloneCount += 1;
}
