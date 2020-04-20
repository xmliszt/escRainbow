import rainbowSDK from './../js/rainbow-sdk.min.js';
import {generateButton} from './../js/elementsUtils.js';
import {generateResponseBubbleForAgent, generateResponseBubbleWithInsertionElements, generateResponseBubble} from "./../js/bubbleGenerator.js";
import {stopTimeOutEvent, startTimeOutForReminder} from "./../js/timeUtil.js";
import {createCallbackResponseForButton} from "./../js/buttonActionCreator.js";

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
                    var can = rainbowSDK.webRTC.canMakeAudioVideoCall();
                    if (can){
                        stopTimeOutEvent();
                        rainbowSDK.webRTC.callInAudio(contact);
                    } else {
                        generateResponseBubble("Your device does not support audio/video call!", 0, false);
                    }
                });
                createCallbackResponseForButton(`#call-video-${call_count}`, () => {
                    var can = rainbowSDK.webRTC.canMakeAudioVideoCall();
                    if (can){
                        stopTimeOutEvent();
                        rainbowSDK.webRTC.callInVideo(contact);
                    } else {
                        generateResponseBubble("Your device does not support audio/video call!", 0, false);
                    }
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
            stopTimeOutEvent();

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
            generateResponseBubbleForAgent("Call has ended...", 0, false);
            rainbowSDK.webRTC.hideLocalVideo();
            rainbowSDK.webRTC.hideRemoteVideo(call);
            startTimeOutForReminder(3);
        } else if (call.status.value == "incommingCall"){
            var can = rainbowSDK.webRTC.canMakeAudioVideoCall();
            var micro = rainbowSDK.webRTC.hasAMicrophone();
            var cam = rainbowSDK.webRTC.hasACamera();
            console.log(`Microhpone: ${micro} Camera: ${cam}`);
            if (can){
                console.log("Receive incomming call...");
                var elements = [
                    generateButton(`incoming-accept-${call_count}`, "Accept", 1),
                    generateButton(`incoming-decline-${call_count}`, "Decline", 0)
                ];
                generateResponseBubbleWithInsertionElements("Incoming call...", 0, elements, false);
                createCallbackResponseForButton(`#incoming-accept-${call_count}`, () => {
                    if (call.remoteMedia === 3) {
                        // video
                        $('.video-stream').css("display", "flex").hide().fadeIn();
                        $('#stopConnection').click(() => {
                            rainbowSDK.webRTC.release(call);
                        });
                        rainbowSDK.webRTC.answerInVideo(call);
                    } else if (call.remoteMedia === 1) {
                        // audio
                        rainbowSDK.webRTC.answerInAudio(call);
                    }
                });
                createCallbackResponseForButton(`#incoming-decline-${call_count}`, () => {
                    rainbowSDK.webRTC.release(call);
                });
                call_count ++;
            } else {
                generateResponseBubble("Your device does not support audio/video call!", 0, false);
                rainbowSDK.webRTC.release(call);
            }
            
        } else if (call.status.value == "answering"){
            stopTimeOutEvent();
            if (call.remoteMedia == 3){
                rainbowSDK.webRTC.showLocalVideo();
                rainbowSDK.webRTC.showRemoteVideo(call);
                generateResponseBubble(`<i class="fas fa-video"></i><span> </span><i class="fas fa-ellipsis-h"></i><i class="fas fa-ellipsis-h"></i>  call in progress...`, 0, false);
            } else if (call.remoteMedia == 1){
                var elements = [
                    generateButton(`call-connection-${call_count}`, "TERMINATE THE CALL", 1)
                ];
                generateResponseBubbleWithInsertionElements(`<i class="fas fa-microphone-alt"></i><span> </span><i class="fas fa-ellipsis-h"></i><i class="fas fa-ellipsis-h"></i>  call in progress...`, 0, elements, false);
                createCallbackResponseForButton(`#call-connection-${call_count}`, () => {
                    rainbowSDK.webRTC.release(call);
                });
            }
           
        } else {
            console.log("Unhandled call event!");
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