$(document).ready(function() {

    $.ajax({
        type: "POST",
        url: '/',
        success: function(data, status, els){
            mainLoop(data);
        }
    });

    console.log("[DEMO] :: Rainbow Application started!");

    // Update the variables below with your applicationID and applicationSecret strings
    var applicationID = "47a88e404ed911ea819a43cb4a9dae9b",
        applicationSecret = "GXWv2NNkOnZ573jTlLo6vq3vc05PEgiObRGf0jAWfTXYe01LkN72kzGpXkkpvqf9";

    /* Bootstrap the SDK */
    angular.bootstrap(document, ["sdk"]).get("rainbowSDK");

    /* Callback for handling the event 'RAINBOW_ONREADY' */
    var onReady = function onReady() {
        console.log("[DEMO] :: On SDK Ready !");
        // do something when the SDK is ready
    };

    /* Callback for handling the event 'RAINBOW_ONCONNECTIONSTATECHANGED' */
    var onLoaded = function onLoaded() {
        console.log("[DEMO] :: On SDK Loaded !");

        // Activate full SDK log
        rainbowSDK.setVerboseLog(true);

        rainbowSDK
            .initialize(applicationID, applicationSecret)
            .then(function() {
                console.log("[DEMO] :: Rainbow SDK is initialized!");
            })
            .catch(function(err) {
                console.log("[DEMO] :: Something went wrong with the SDK...", err);
            });

        
    };

    // set up listener for message
    let onMessageReceived = function(event){
        let message = event.detail.message;
        let conversation = event.detail.conversation;
        rainbowSDK.im.markMessageFromConversationAsRead(conversation, message);
        $('.msgRev').append(
            `<p>Message Received: ${message.data}<p>`
        );
    };
    document.addEventListener(rainbowSDK.im.RAINBOW_ONNEWIMMESSAGERECEIVED, onMessageReceived);

    /* Listen to the SDK event RAINBOW_ONREADY */
    document.addEventListener(rainbowSDK.RAINBOW_ONREADY, onReady)

    /* Listen to the SDK event RAINBOW_ONLOADED */
    document.addEventListener(rainbowSDK.RAINBOW_ONLOADED, onLoaded)

    rainbowSDK.load();

});

function mainLoop(data){
    // sigin the guest
    var email = data.data.loginEmail;
    var pwd = data.data.password;
    var agent1USR = "5e5e23236c332176648fe57e";
    rainbowSDK.connection.signin(email, pwd).then(success=>{
        console.log("Guest signed in successfully! "+success.account.roles);
        // find the agent and retrieve a conversation with him
        rainbowSDK.contacts.searchById(agent1USR).then(contact=>{
            console.log("Agent found: " + contact.firstname); 
            rainbowSDK.conversations.openConversationForContact(contact).then(conversation=>{
                var lastMessage = conversation.lastMessageText;
                $('#submitBtn').click(function(){
                    var sending = $('.userInput').val();
                    rainbowSDK.im.sendMessageToConversation(conversation, sending);
                    $('.msgRev').append(
                        `<p>Message Sent by Guest: ${sending}<p>`
                    );
                });
                console.log("Last message in conversation: " + lastMessage);
            }).catch(err=>{
                console.error("Failed to open conversation! "+ err);
            });
        }).catch(err=>{console.error("Failed to find agent: " + err)});
    }).catch(err=>{
        console.error("Failed to sign in guest! " + err);
    });
}