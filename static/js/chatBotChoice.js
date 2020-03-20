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
                <br>
                <span class="msg_body">Type <b>"help"</b> to bring up the choices again.</span>
                <br>
                <span class="msg_body">Still have questions? Click on </span><img class="agent-icon" src="/icon/agent.png" style="cursor: auto"><span> to call our agents for help.</span>
            </div>
        </div>
        <span class="msg_time">${dateTime}</span>
    </div>`);
    $('#conversation_body').append(responseBubble);
    scrollToBottom();
    
    // Sub response for GENERAL ENQUERIES
    createCallbackResponseForButton(`#${cloneCount*5+0}`, function(){
        var elements = [
            generateButton(`ge-${cloneCount*5+0}`, "Show me account types", 0),
            generateButton(`ge-${cloneCount*5+1}`, "iBanking", 1),
        ];
        generateResponseBubbleWithInsertionElements("You selected general enqueries: ", 0, elements);
        createCallbackResponseForButton(`#ge-${cloneCount*5+0}`, function(){ 
            var elements = [
                generateButton(`ge-sub${cloneCount*5+0}`, "Day to Day", 0),
                generateButton(`ge-sub${cloneCount*5+1}`, "Fixed Deposit", 1),
        ];
            generateResponseBubbleWithInsertionElements("Which account type do you prefer? ", 0, elements);
            var msg1 = `
                <ol>
                    <li>Account Mutiplier</li>
                    <li>Autosave Account</li>
                </ol>
                `;
            createResponseMessageForButton(`#ge-sub${cloneCount*5+0}`, msg1, 0);
            var msg2 = `
            <ol>
                <li>Singapore Dollar Fixed Deposit</li>
                <li>Foreign Currency Fixed Deposit</li>
            </ol>
            `;
            createResponseMessageForButton(`#ge-sub${cloneCount*5+1}`, msg2, 0);

        }); 

        createCallbackResponseForButton(`#ge-${cloneCount*5+1}`, function(){ 
            var elements = [
                generateButton(`ge-sub${cloneCount*5+0}`, "What is the eligibility to apply for iBanking?", 0),
                generateButton(`ge-sub${cloneCount*5+1}`, "What can i do on iBanking?", 1),
        ];
            generateResponseBubbleWithInsertionElements("I am wondering ... ", 0, elements);
            var msg1 = `
                <ol>
                    <li>At least 16 years old</li>
                    <li>Have a personal or joint alternate account</li>
                </ol>
                `;
            createResponseMessageForButton(`#ge-sub${cloneCount*5+0}`, msg1, 0);
            var msg2 = `
            <ol>
                <li>Account summary</li>
                <li>Make credit card payments</li>
                <li>Make local or overseas transfers</li>
                <li>Make investments</li>
            </ol>
            `;
            createResponseMessageForButton(`#ge-sub${cloneCount*5+1}`, msg2, 0);

        }); 
        current_query = 0;
        console.log("Query set to 0");
     });

     // Sub response for CARD REPLACEMENT
     createCallbackResponseForButton(`#${cloneCount*5+1}`, function(){
        var elements = [
            generateButton(`cd-${cloneCount*5+0}`, "Yes please", 0),
            generateButton(`cd-${cloneCount*5+1}`, "Nope, I have already done so", 1)
        ];
        generateResponseBubbleWithInsertionElements("To protect yourself, would you like to deactivate your stolen card? ", 0, elements);
        current_query = 1;
        console.log("Query set to 1");
    });

    // Sub response for investment/loan
    createCallbackResponseForButton(`#${cloneCount*5+2}`, function(){
        var elements = [
            generateButton(`i-${cloneCount*5+0}`, "Show me loan types", 0),
            generateButton(`i-${cloneCount*5+1}`, "Apply for loan", 1)
        ];
        generateResponseBubbleWithInsertionElements("You have selected Investment/Loan:", 0, elements);

        createCallbackResponseForButton(`#i-${cloneCount*5+0}`, function(){ 
            var elements = [generateButton(`i-sub${cloneCount*5+0}`, "Get to know Collaborative Loan", 0)];
            generateResponseBubbleWithInsertionElements("Which loan type do you prefer? ", 0, elements);
            var msg1 = `
                    <p>
                    Collaborative Loans invest a pool of money, collected from a number of investors, in a range of assest. 
                    <ol>
                        <li>Invest in stocks</li>
                        <li>Invest in bonds </li>
                        <li>Invest in a mix of stocks and bonds </li>
                    </ol>
                    </p>
                    `;
            createResponseMessageForButton(`#i-sub${cloneCount*5+0}`, msg1, 0);
    }); 
    

        current_query = 2;
        console.log("Query set to 2");
    });

    
    
    // sub response for overseas spending
    createResponseMessageForButton(`#${cloneCount*5+3}`, "You selected Overseas Spending Activation", 0, 3);

    cloneCount += 1;
}
