var email;
var pwd;
var intervalCallAgent;

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
            agentInfo = data.info;
            console.log(agentInfo);
            rainbowSDK.contacts.searchById(agentInfo.id)
            .then(contact=>{
                console.log("Agent found: " + contact.firstname); 
                rainbowSDK.conversations.openConversationForContact(contact)
                .then(conversation=>{
                    console.log(`Conversation ${conversation.id} is opened successfully!`);
                    stopCallAgent();
                    mConversation = conversation;
                    generateResponseBubbleForAgent(`You are connected to agent: ${agentInfo.name}. ID: ${agentInfo.id}`, 0);
                    rainbowSDK.im.sendMessageToConversation(conversation, `You are connected with guest user [${email}]`);
                })
                .catch(err=>{
                    console.error("Failed to open conversation! "+ err);
                });
            }).catch(err=>{console.info("Failed to find agent: " + err)});
        },
        error: function(error, status, els){
            if (error.status == 501){
                console.info(error.responseJSON.error);
                intervalCallAgent(1000);
            }
        }
    });
}

function callAgent(){
    generateSendBubbleConnectingAgent("Connecting to available agent...");
    $.ajax({
        url: '/chat',
        type: 'GET',
        success: function(data, status, els){
            console.log(`Guest account sigin successfully! ${data.data.loginEmail}`);
            email = data.data.loginEmail;
            pwd = data.data.password;
            rainbowSDK.connection.signin(email, pwd).then(success=>{
                connectAgent();
            }).catch(err =>{
                console.error("Failed to sign in guest account!");
                generateResponseBubble("Connection refused. Please try again!", 0);
            });
        }
    });
}
    
function disconnect(){
    rainbowSDK.im.sendMessageToConversation(mConversation, `You have been disconnected with guest user [${email}]`);
    rainbowSDK.conversations.closeConversation(mConversation).then(success=>{
        console.log(`Conversation ${mConversation.id} successfully closed!`);
        generateResponseBubble(`Conversation with agent ${agentInfo.name} has been terminated!`, 0);
        generateBotChoicesBubble();
        $.ajax({
            url: '/disconnect',
            type: 'POST',
            data: {agentID: agentInfo.id},
            success: function(data, status, els){
                console.log(`Agent [${data.id}] freed successfully!`);
                rainbowSDK.connection.signout().then(success=>{
                    console.log("Guest account signout successfully!");
                }).catch(err=>{
                    console.error("Guest account signout failed!");
                    console.error(err);
                })
            },
            error: function(err){
                console.error(err.responseText);
            }
        });
    }).catch(err=>{
        console.error("Failed to close the conversation " + err);
    });
}