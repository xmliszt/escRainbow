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
                <button class="q4 btn btn-sm btn-primary" id="${cloneCount*5+4}">Chat With Agents</button><br>
                <span class="msg_body">Type <b>"help"</b> to bring up the choices again.</span>
            </div>
        </div>
        <span class="msg_time">${dateTime}</span>
    </div>`);
    $('#conversation_body').append(responseBubble);
    scrollToBottom();

    var handleBotChoiceURL = `/bot/choices/${getPartFromURL(window.location.href,2)}`;
    console.log(handleBotChoiceURL);

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
     });

     // Sub response for CARD REPLACEMENT
    createResponseMessageForButton(`#${cloneCount*5+1}`, "Card replacement information", 0);

    // Sub response for 
    createResponseWithAjaxForButton(`#${cloneCount*5+2}`, "You selected Investment/Loan", 0, "POST", handleBotChoiceURL, {choice:2}, function(data, status,els){
        var response = data.response.message;
        generateResponseBubble(response, 0);
    });
    
    //
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
