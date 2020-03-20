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
            generateButton(`ge-${cloneCount*5+0}`, "Show me account types", 0),
            generateButton(`ge-${cloneCount*5+1}`, "Ibanking", 1),
            //generateButton(`ge-${cloneCount*5+2}`, "Hello", 2)
    ];
        //button response 
        generateResponseBubbleWithInsertionElements("You selected general enqueries: ", 0, elements);
        //createResponseMessageForButton(`#ge-${cloneCount*5+0}`, "Day"); 
        //createResponseMessageForButton(`#ge-${cloneCount*5+1}`, "It is doing bank stuff on the Internet");
        
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
            <p>
            wieubia
            <ol>
                <li>Account summary</li>
                <li>Make credit card payments</li>
                <li>Make local or overseas transfers</li>
                <li>Make investments</li>
            </ol>
            </p>
            `;
            createResponseMessageForButton(`#ge-sub${cloneCount*5+1}`, msg2, 0);

        }); 
       
        
     });

     // Sub response for CARD REPLACEMENT
    createCallbackResponseForButton(`#${cloneCount*5+1}`, function(){
    var elements = [
        generateButton(`cd-${cloneCount*5+0}`, "Yes please", 0),
        generateButton(`cd-${cloneCount*5+1}`, "Nope, I have already done so", 1)
    ];
    generateResponseBubbleWithInsertionElements("To protect yourself, would you like to deactivate your stolen card? ", 0, elements);

    //if customer is already signed in 
    createCallbackResponseForButton(`#cd-${cloneCount*5+0}`, function(){
    // if customer is already signed in (for all below)
        generateResponseBubble("Please key in your card number", 0); 
        //set time out 
        generateResponseBubble("Successful deactivation of card!", 0);
        //set time out (lesser time)
        var elements = [
            generateButton(`cd-sub1${cloneCount*5+0}`, "Yes", 0),
            generateButton(`cd-sub1${cloneCount*5+1}`, "Nope", 1)
        ];
        generateResponseBubbleWithInsertionElements("Shall we proceed with card replacement?", 0, elements);
        // if customer is already signed in (for yes)
        createResponseMessageForButton(`#cd-sub1${cloneCount*5+0}`, "Rest assured, a new bank card and PIN number will be mailed to you within a week.", 0); 
        createResponseMessageForButton(`#cd-sub1${cloneCount*5+1}`, "Thank you for the conversation! Hope we have resolved your issue!",0); 

    }); 
    
    createCallbackResponseForButton(`#cd-${cloneCount*5+1}`, function(){
        var elements = [
            generateButton(`cd-sub2${cloneCount*5+0}`, "Yes", 0),
            generateButton(`cd-sub2${cloneCount*5+1}`, "Nope", 1)
        ];
        generateResponseBubbleWithInsertionElements("Shall we proceed with card replacement?", 0, elements);
        // if customer is already signed in (for yes)
        createResponseMessageForButton(`#cd-sub2${cloneCount*5+0}`, "Rest assured, a new bank card and PIN number will be mailed to you within a week.", 0); 
        createResponseMessageForButton(`#cd-sub2${cloneCount*5+1}`, "Thank you for the conversation! Hope we have resolved your issue!",0); 
    }); 
    
    
    
    });

    //Sub response for Investment/Loan
    createCallbackResponseForButton(`#${cloneCount*5+2}`, function(){
        var elements = [
            generateButton(`i-${cloneCount*5+0}`, "Show me loan types", 0),
            generateButton(`i-${cloneCount*5+1}`, "Apply for loan", 1)
        ];
        generateResponseBubbleWithInsertionElements("You have selected Investment/Loan:", 0, elements);


        createCallbackResponseForButton(`#i-${cloneCount*5+0}`, function(){ 
        var elements = [
                generateButton(`i-sub1${cloneCount*5+0}`, "Get to know Collaborative Loan", 0),

        ];
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
        createResponseMessageForButton(`#i-sub1${cloneCount*5+0}`, msg1, 0);
        }); 


        createCallbackResponseForButton(`#i-${cloneCount*5+1}`, function(){
        //if customer is already signed in (for all below)
            var elements = [
                generateButton(`i-sub2${cloneCount*5+0}`, "Collaborative Loan", 0),
                generateButton(`i-sub2${cloneCount*5+1}`, "Fly with Alpha Holding", 1)
            ];
            generateResponseBubbleWithInsertionElements("Please select the loan type you would like to apply for:", 0, elements);
            createCallbackResponseForButton(`#i-sub2${cloneCount*5+0}`, function(){
                //set time out 
                generateResponseBubble("Successfully creation of loan!", 0); 
            }); 
            createCallbackResponseForButton(`#i-sub2${cloneCount*5+1}`, function(){
                //set time out 
                generateResponseBubble("Successfully creation of loan!", 0); 
            });
        });

    }); 
        
    //Sub response for Overseas Spending Activation
    createCallbackResponseForButton(`#${cloneCount*5+3}`, function(){
    //if customer is already signed in (for all below)
        generateResponseBubble("Please key in your credit card number:", 0); 
        //set time out 
        generateResponseBubble("Successful Overseas Spending Activation!", 0); 
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
