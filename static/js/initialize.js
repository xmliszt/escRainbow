import rainbowSDK from './../js/rainbow-sdk.min.js';
import {generateResponseBubbleForAgent, 
    generateResponseBubbleWithInsertionElements, 
    generateButton, 
    createCallbackResponseForButton,
    generateSendBubble,
    generateResponseBubble,
    stopTimeOutEvent,
    startTimeOutForReminder} from './../js/elementsUtils.js';

var call_count = 0;

async function initialize(){

    console.log("[DEMO] :: Rainbow Application started!");
    var applicationID = "47a88e404ed911ea819a43cb4a9dae9b";
    var applicationSecret = "GXWv2NNkOnZ573jTlLo6vq3vc05PEgiObRGf0jAWfTXYe01LkN72kzGpXkkpvqf9";

    var onReady = function onReady() {
        console.log('[Hello World] :: On SDK Ready !');
    };
    
    var onLoaded = function onLoaded() {
        console.log('[Hello World] :: On SDK Loaded !');
    
        rainbowSDK
            .initialize(applicationID, applicationSecret)
            .then(() => {
                console.log('[Hello World] :: Rainbow SDK is initialized!');
            })
            .catch(err => {
                console.log('[Hello World] :: Something went wrong with the SDK.', err);
            });
    };


    // set up listener for message
    let onMessageReceived = function(event){
        let message = event.detail.message;
        let conversation = event.detail.conversation;
        console.log(message.data);
        if (message.data == "\\call"){
            var agentID = localStorage.getItem("agent-id");
            rainbowSDK.contacts.searchById(agentID).then(contact=>{
            // agent request for initiating a call
                rainbowSDK.im.markMessageFromConversationAsRead(conversation, message);
                var elements = [
                    generateButton(`call-audio-${call_count}`, "Audio", 0),
                    generateButton(`call-video-${call_count}`, "Video", 1)
                ];
                generateResponseBubbleWithInsertionElements("The agent has initiated a call request. Please select one of the options to start the call...", 0, elements, false);
                createCallbackResponseForButton(`#call-audio-${call_count}`, () => {
                    stopTimeOutEvent();
                    rainbowSDK.webRTC.callInAudio(contact);
                });
                createCallbackResponseForButton(`#call-video-${call_count}`, () => {
                    stopTimeOutEvent();
                    rainbowSDK.webRTC.callInVideo(contact);
                });
            }).catch(err=>{
                console.error("Failed to find agent!");
            });
            call_count ++;
        } else {
            rainbowSDK.im.markMessageFromConversationAsRead(conversation, message);
            generateResponseBubbleForAgent(message.data, message.from.lastname + " " + message.from.firstname);
        }
    };

    let onCallReceived = (event) => {
        let call = event.detail;
        if (call.status.value == "dialing"){
            console.log("Dialing...")
            generateResponseBubble("Calling... Please wait...", 0, false);
        } else if (call.status.value == "connecting"){
            console.log("Connected");

            if (call.localMedia == 1){
                var elements = [
                    generateButton(`call-connection-${call_count}`, "TERMINATE THE CALL", 1)
                ];
                generateResponseBubbleWithInsertionElements(`<i class="fas fa-microphone-alt"></i><span> </span><i class="fas fa-ellipsis-h"></i><i class="fas fa-ellipsis-h"></i>  call in progress...`, 0, elements, false);
                createCallbackResponseForButton(`#call-connection-${call_count}`, () => {
                    rainbowSDK.webRTC.release(call);
                });

            } else if (call.localMedia == 3){
                //Video connection
                $('.video-stream').css("display", "flex").hide().fadeIn();
                $('#stopConnection').click(() => {
                    rainbowSDK.webRTC.release(call);
                });
                
                console.log(call);
                var res = rainbowSDK.webRTC.showRemoteVideo(call);
                console.log(res);

                rainbowSDK.webRTC.showLocalVideo();
                generateResponseBubble(`<i class="fas fa-video"></i><span> </span><i class="fas fa-ellipsis-h"></i><i class="fas fa-ellipsis-h"></i>  call in progress...`, 0, false);

            }
        } else if (call.status.value == "Unknown") {
            console.log("Call ended!");
            $('.video-stream').hide();
            generateResponseBubble("Call has ended...", 0);
            rainbowSDK.webRTC.hideLocalVideo();
            rainbowSDK.webRTC.hideRemoteVideo(call);
            startTimeOutForReminder(3);
        } else {
            console.log(call);
        }
    }

    let onConversationRemoved = (conversation) => {
        console.log("Conversation is removed!");
    }

    let onConversationChanged = (cid) => {
    //   console.log("Conversation ID changed to " + cid.detail);
        localStorage.setItem("conversation", cid.detail);
    }

    let onWebRTCErrorHandled = (e) => {
        let errorSDK = e.detail;
        console.log("WebRTC ERROR", errorSDK);
    }

    let onWebRTCRemoteStreamAdded = (streams) => {
        console.log("Web RTC stream added!");
        console.log(streams);
    }

  document.addEventListener(rainbowSDK.webRTC.RAINBOW_ONWEBRTCSTREAMADDED, onWebRTCRemoteStreamAdded);

  document.addEventListener(rainbowSDK.webRTC.RAINBOW_ONWEBRTCERRORHANDLED, onWebRTCErrorHandled);

  document.addEventListener(rainbowSDK.conversations.RAINBOW_ONCONVERSATIONCHANGED, onConversationChanged);

  document.addEventListener(rainbowSDK.conversations.RAINBOW_ONCONVERSATIONREMOVED, onConversationRemoved);

  document.addEventListener(rainbowSDK.webRTC.RAINBOW_ONWEBRTCCALLSTATECHANGED, onCallReceived);

  document.addEventListener(rainbowSDK.im.RAINBOW_ONNEWIMMESSAGERECEIVED, onMessageReceived);

  /* Listen to the SDK event RAINBOW_ONREADY */
  document.addEventListener(rainbowSDK.RAINBOW_ONREADY, onReady)

  /* Listen to the SDK event RAINBOW_ONLOADED */
  document.addEventListener(rainbowSDK.RAINBOW_ONLOADED, onLoaded)

  rainbowSDK.start();
  rainbowSDK.load();

  /** END OF RAINBOW SECTION */
}

export {initialize};