import {
    generateResponseBubble,
    generateResponseBubbleWithInsertionElements,
    getDateTime,
    scrollToBottom,
    createCallbackResponseForButton,
    createResponseMessageForButton,
    generateButton,
    waitSeconds
} from "./../js/elementsUtils.js";


var current_query = 0;
var subResponseCount = 0;
var cloneCount = 0;

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
            generateButton(`ge-${subResponseCount*5+0}`, "Show me account types", 0),
            generateButton(`ge-${subResponseCount*5+1}`, "iBanking", 1),
        ];
        generateResponseBubbleWithInsertionElements("You selected general enqueries: ", 0, elements);
        createCallbackResponseForButton(`#ge-${subResponseCount*5+0}`, function(){ 
            var elements = [
                generateButton(`ge-sub${subResponseCount*5+0}`, "Day to Day", 0),
                generateButton(`ge-sub${subResponseCount*5+1}`, "Fixed Deposit", 1),
        ];
            generateResponseBubbleWithInsertionElements("Which account type do you prefer? ", 0, elements);
            var msg1 = `
                <ol>
                    <li>Account Mutiplier</li>
                    <li>Autosave Account</li>
                </ol>
                `;
            createResponseMessageForButton(`#ge-sub${subResponseCount*5+0}`, msg1, 0);
            var msg2 = `
            <ol>
                <li>Singapore Dollar Fixed Deposit</li>
                <li>Foreign Currency Fixed Deposit</li>
            </ol>
            `;
            createResponseMessageForButton(`#ge-sub${subResponseCount*5+1}`, msg2, 0);
            subResponseCount ++;
        }); 

        createCallbackResponseForButton(`#ge-${subResponseCount*5+1}`, function(){ 
            var elements = [
                generateButton(`ge-sub-sub${subResponseCount*5+0}`, "What is the eligibility to apply for iBanking?", 0),
                generateButton(`ge-sub-sub${subResponseCount*5+1}`, "What can i do on iBanking?", 1),
        ];
            generateResponseBubbleWithInsertionElements("I am wondering ... ", 0, elements);
            var msg1 = `
                <ol>
                    <li>At least 16 years old</li>
                    <li>Have a personal or joint alternate account</li>
                </ol>
                `;
            createResponseMessageForButton(`#ge-sub-sub${subResponseCount*5+0}`, msg1, 0);
            var msg2 = `
            <ol>
                <li>Account summary</li>
                <li>Make credit card payments</li>
                <li>Make local or overseas transfers</li>
                <li>Make investments</li>
            </ol>
            `;
            createResponseMessageForButton(`#ge-sub-sub${subResponseCount*5+1}`, msg2, 0);
            subResponseCount ++;
        }); 
        current_query = 0;
        console.log("Query set to 0");
     });

     // Sub response for CARD REPLACEMENT
     createCallbackResponseForButton(`#${cloneCount*5+1}`, function(){
        var elements = [
            generateButton(`cd-${subResponseCount*5+0}`, "Yes please", 0),
            generateButton(`cd-${subResponseCount*5+1}`, "I need more time to think about it", 1)
        ];
        generateResponseBubbleWithInsertionElements("To protect yourself, would you like to deactivate your stolen card? ", 0, elements);

        //if customer is already signed in 
        createCallbackResponseForButton(`#cd-${subResponseCount*5+0}`, function(){
            $.ajax({
                url: "/auth",
                type: "GET",
                success: function(data){
                    if (data.loggedIn){
                        // if customer is already signed in (for all below)
                        generateResponseBubble("Please key in your card number", 0); 
                        //set time out 
                        waitSeconds(2, generateResponseBubble.bind(this, "Card number matched records. We are deactivating your card now... Please wait.", 0));
                        waitSeconds(10, generateResponseBubble.bind(this, "Successful deactivation of card!", 0));
                        var elements = [
                            generateButton(`cd-sub1-${subResponseCount*5+0}`, "Yes", 0),
                            generateButton(`cd-sub1-${subResponseCount*5+1}`, "Nope", 1)
                        ];

                        waitSeconds(13, generateResponseBubbleWithInsertionElements.bind(this, "Shall we proceed with card replacement?", 0, elements));
                        waitSeconds(13, createResponseMessageForButton.bind(this, `#cd-sub1-${subResponseCount*5+0}`, "Rest assured, a new bank card and PIN number will be mailed to you within a week.", 0));
                        waitSeconds(13, createResponseMessageForButton.bind(this, `#cd-sub1-${subResponseCount*5+1}`, "Thank you for the conversation! Hope we have resolved your issue!",0));
                    }
                },
                error: function(error){
                    if (error.status == 401){
                        var element = [
                            generateButton(`resignin-${subResponseCount*5+0}`, "Sign In", 0)
                        ];
                        generateResponseBubbleWithInsertionElements("To proceed, you are required to sign in to your iBanking account.", 0, element);
                        createCallbackResponseForButton(`#resignin-${subResponseCount*5+0}`, function(){
                            $('#myForm').show();
                            $(".chat").animate({ opacity: "0.0", bottom: "0" }, "slow");
                            $(".chat").hide();
                            $(".toggle-chat-btn").show();
                            $(".toggle-chat-btn").animate({ opacity: "1.0" }, "slow");
                        })
                    }
                }
            });
            
        }); 
    
        createResponseMessageForButton(`#cd-${subResponseCount*5+1}`, "If you have any queries, click the button below to talk to our agents.", 0); 
        subResponseCount ++;
        current_query = 1;
        console.log("Query set to 1");
    });

    // Sub response for investment/loan
    createCallbackResponseForButton(`#${cloneCount*5+2}`, function(){
        var elements = [
            generateButton(`i-${subResponseCount*5+0}`, "Show me loan types", 0),
            generateButton(`i-${subResponseCount*5+1}`, "Apply for loan", 1)
        ];
        generateResponseBubbleWithInsertionElements("You have selected Investment/Loan:", 0, elements);

        createCallbackResponseForButton(`#i-${subResponseCount*5+0}`, function(){ 
            var elements = [generateButton(`i-sub-${subResponseCount*5+0}`, "Get to know Collaborative Loan", 0)];
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
            createResponseMessageForButton(`#i-sub-${subResponseCount*5+0}`, msg1, 0);
        }); 
        createCallbackResponseForButton(`#i-${subResponseCount*5+1}`, function(){

            $.ajax({
                url: "/auth",
                type: "GET",
                success: function(data){
                    //if customer is already signed in (for all below)
                    var elements = [
                        generateButton(`i-sub2-${subResponseCount*5+0}`, "Collaborative Loan", 0),
                        generateButton(`i-sub2-${subResponseCount*5+1}`, "Fly with Alpha Holding", 1)
                    ];
                    generateResponseBubbleWithInsertionElements("Please select the loan type you would like to apply for:", 0, elements);
                    createCallbackResponseForButton(`#i-sub2-${subResponseCount*5+0}`, function(){
                        //set time out 
                        waitSeconds(2, generateResponseBubble.bind(this, "...", 0))
                        waitSeconds(7, generateResponseBubble.bind(this, "Successfully creation of loan!", 0))
                    }); 
                    createCallbackResponseForButton(`#i-sub2-${subResponseCount*5+1}`, function(){
                        //set time out 
                        waitSeconds(2, generateResponseBubble.bind(this, "...", 0))
                        waitSeconds(5, generateResponseBubble.bind(this, "Successfully creation of loan!", 0))
                    });
                },
                error: function(error){
                    if (error.status == 401){
                        var element = [
                            generateButton(`resignin-i-${subResponseCount*5+0}`, "Sign In", 0)
                        ];
                        generateResponseBubbleWithInsertionElements("To proceed, you are required to sign in to your iBanking account.", 0, element);
                        createCallbackResponseForButton(`#resignin-i-${subResponseCount*5+0}`, function(){
                            $('#myForm').show();
                            $(".chat").animate({ opacity: "0.0", bottom: "0" }, "slow");
                            $(".chat").hide();
                            $(".toggle-chat-btn").show();
                            $(".toggle-chat-btn").animate({ opacity: "1.0" }, "slow");
                        })
                    }
                }
            });
        });
        subResponseCount++;
        current_query = 2;
        console.log("Query set to 2");
    });

    
    
    // sub response for overseas spending
    createCallbackResponseForButton(`#${cloneCount*5+3}`, function(){

        $.ajax({
            url: "/auth",
            type: "GET",
            success: function(data){
                if (data.loggedIn){
                    //if customer is already signed in (for all below)
                    generateResponseBubble("Please key in your credit card number:", 0); 
                    waitSeconds(3, generateResponseBubble.bind(this, "Credit card number received and matched! Please wait...", 0));
                    waitSeconds(10, generateResponseBubble.bind(this, "Successful Overseas Spending Activation!", 0));
                }
            },
            error: function(error){
                if (error.status == 401){
                    var element = [
                        generateButton(`resignin-oa-${subResponseCount*5+0}`, "Sign In", 0)
                    ];
                    generateResponseBubbleWithInsertionElements("To proceed, you are required to sign in to your iBanking account.", 0, element);
                    createCallbackResponseForButton(`#resignin-oa-${subResponseCount*5+0}`, function(){
                        $('#myForm').show();
                        $(".chat").animate({ opacity: "0.0", bottom: "0" }, "slow");
                        $(".chat").hide();
                        $(".toggle-chat-btn").show();
                        $(".toggle-chat-btn").animate({ opacity: "1.0" }, "slow");
                    })
                }
            }
        });
        subResponseCount ++;
        current_query = 3;
        console.log("Query set to 3");

    }); 
    cloneCount += 1;

}

export {generateBotChoicesBubble, current_query};