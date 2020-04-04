import rainbowSDK from './../js/rainbow-sdk.min.js';
import {
    stopTimeOutEvent, 
    stopIntervalEvent,
    generateResponseBubble,
    generateResponseBubbleForAgent,
    generateSendBubble,
    startTimeOutForReminder,
    startTimeOutForTerminateCallAgent
} from "./../js/elementsUtils.js";
import {generateBotChoicesBubble, current_query} from "./../js/chatBotChoice.js";

var email;
var pwd;
var agentName;
var agentID;
var conversationID;
var intervalEvent;
var mConversation;
var contact;

// simple version:  function for agent routing
function connectAgent(){
    $.ajax({
        url: '/connect',
        data: {request: current_query},
        type: "POST",
        success: function(data, status, els){
            stopIntervalEvent();
            console.log("Connect to agent successfully!");
            var agentInfo = data.info;
            console.log(agentInfo);
            rainbowSDK.contacts.searchById(agentInfo.id)
            .then(contact=>{
                console.log("Agent found: " + contact.firstname); 
                contact = contact;
                rainbowSDK.conversations.openConversationForContact(contact)
                .then(conversation=>{
                    mConversation = conversation;
                    console.log(`Conversation ${conversation.id} is opened successfully!`);
                    stopTimeOutEvent();
                    localStorage.setItem("conversation", conversation.id);
                    localStorage.setItem("agent-id", agentInfo.id);
                    localStorage.setItem("agent-name", agentInfo.name);
                    generateResponseBubbleForAgent(`You are connected to agent: ${agentInfo.name}. ID: ${agentInfo.id}`, 0);
                    startTimeOutForReminder(3);
                    rainbowSDK.im.sendMessageToConversation(conversation, `You are connected with guest user [${email}]`);
                    // rainbowSDK.webRTC.callInVideo(contact);
                })
                .catch(err=>{
                    console.error("Failed to open conversation! "+ err);
                });
            }).catch(err=>{console.info("Failed to find agent: " + err)});
        },
        error: function(error){
            if (error.status == 501){
                console.error("Unable to connect");
                setTimeout(connectAgent, 2000);
                console.info(error.responseJSON.error);
            }
        }
    });
}

function callAgent(){
    generateSendBubble("Connecting to available agent...");
    $.ajax({
        url: '/chat',
        type: 'GET',
        success: function(data, status, els){
            // email = "agent2@alpha.com";
            // pwd = "~!@SUTDsutd123";
            email = data.data.loginEmail;
            pwd = data.data.password;
            rainbowSDK.connection.signin(email, pwd).then(success=>{
                console.log(`Guest account sigin successfully! ${data.data.loginEmail}`);
                connectAgent();
                console.log("Creating Interval ID: " + intervalEvent);
                startTimeOutForTerminateCallAgent(1);
            }).catch(err =>{
                console.error("Failed to sign in guest account!");
                console.error(err);
                generateResponseBubble("Connection refused. Please try again!", 0);
            });
        }
    });
}
    
async function disconnect(){
    var storedConversation;
    stopTimeOutEvent();
    conversationID = localStorage.getItem("conversation");
    agentID = localStorage.getItem("agent-id");
    agentName = localStorage.getItem("agent-name");
    console.log(`Start disconnection... [${conversationID}]`);
    console.log("Guest signed out successfully!");
    if (conversationID){
        storedConversation = await rainbowSDK.conversations.getConversationById(conversationID);
    } else {
        storedConversation = null;
    }
    console.log(storedConversation);
    if (storedConversation){
        rainbowSDK.im.sendMessageToConversation(storedConversation, `You have been disconnected with guest user [${email}]`);
        rainbowSDK.conversations.closeConversation(storedConversation).then(success=>{
            cleanUpWhenConversationClosed();
        }).catch(err=>{
            console.error("Failed to close the conversation " + err);
        });
    } else {
        if (agentID){
            cleanUpWhenConversationClosed();
        }
    }
}

function cleanUpWhenConversationClosed(){
    generateResponseBubble(`Conversation with agent ${agentName} has been terminated!`, 0);
    generateBotChoicesBubble();
    $.ajax({
        url: '/disconnect',
        type: 'POST',
        data: {agentID: agentID},
        success: function(data, status, els){
            console.log(`Agent [${data.id}] freed successfully!`);
            localStorage.removeItem("conversation");
            localStorage.removeItem("agent-id");
            localStorage.removeItem("agent-name");
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
}

export {disconnect, callAgent, intervalEvent, mConversation, contact};