import rainbowSDK from './../js/rainbow-sdk.min.js';
import {generateResponseBubbleForAgent, 
    generateResponseBubbleWithInsertionElements, 
    generateButton, 
    createCallbackResponseForButton,
    generateSendBubble} from './../js/elementsUtils.js';

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
      console.log(conversation);
      rainbowSDK.im.markMessageFromConversationAsRead(conversation, message);
      generateResponseBubbleForAgent(message.data, message.from.lastname + " " + message.from.firstname);
  };

  let onCallReceived = (call) => {
      let callObject = call.detail;
      if (callObject.status.value === "incommingCall"){
          call_count ++;
          // incoming call
          var canCall = rainbowSDK.webRTC.canMakeAudioVideoCall();
          if (canCall){
            console.log(callObject);
            // var peerConnection = rainbowSDK.webRTC.getPeerConnectionForCall(callObject);
            // console.log("Peer Connection Statistics:");
            // console.log(peerConnection);
            if (callObject.remoteMedia === 3){
                console.log("Received a video call!");
                var caller = callObject.contact.name;
                var elements = [
                    generateButton(`video-call-accept-${call_count}`, "Accept", 1),
                    generateButton(`video-call-decline-${call_count}`, "Decline", 0)
                ];
                generateResponseBubbleWithInsertionElements("Incoming video call request...", caller, elements);
                createCallbackResponseForButton(`#video-call-accept-${call_count}`, () => {
                    generateSendBubble("In video call with agent ...");
                    rainbowSDK.webRTC.answerInVideo(callObject);
                    // rainbowSDK.webRTC.showLocalVideo();
                    // rainbowSDK.webRTC.showRemoteVideo(callObject);
                });
                createCallbackResponseForButton(`#video-call-decline-${call_count}`, () => {
                    generateResponseBubbleForAgent("Video call has been cancelled", 0);
                    rainbowSDK.webRTC.release(callObject);
                    // rainbowSDK.webRTC.hideLocalVideo();
                    // rainbowSDK.webRTC.hideRemoteVideo(callObject);
                });
                // if (rainbowSDK.webRTC.hasACamera()){
                //     console.log("User have a camera!");
                    // rainbowSDK.webRTC.useCamera(localStorage.getItem("camera"));
                    // rainbowSDK.webRTC.useSpeaker(localStorage.getItem("speaker"));

                // }
            } else if (callObject.remoteMedia === 1) {
                console.log("Received an audio call!");
                var caller = callObject.contact.name;
                var elements = [
                    generateButton(`call-accept-${call_count}`, "Accept", 1),
                    generateButton(`call-decline-${call_count}`, "Decline", 0)
                ];
                generateResponseBubbleWithInsertionElements("Incoming call request...", caller, elements);
                createCallbackResponseForButton(`#call-accept-${call_count}`, () => {
                    generateSendBubble("In audio call with agent ...");
                    rainbowSDK.webRTC.answerInAudio(callObject);
                });
                createCallbackResponseForButton(`#call-decline-${call_count}`, () => {
                    generateResponseBubbleForAgent("Audio call has been cancelled", 0);
                    rainbowSDK.webRTC.release(callObject);
                });
                // if (rainbowSDK.webRTC.hasAMicrophone()){
                    // console.log("User have a microphone!");
                    // rainbowSDK.webRTC.useMicrophone(localStorage.getItem("microphone"));
                    // rainbowSDK.webRTC.useSpeaker(localStorage.getItem("speaker"));
                // }
            }
          }
        } else if (callObject.status.value === "active"){
            // if (callObject.remoteMedia & rainbowSDK.Call.Media.VIDEO) {
            //     rainbowSDK.webRTC.displayRemoteVideo(callObject);
            //   } else {
            //     rainbowSDK.webRTC.hideRemoteVideo(callObject);
            //   }
    
            //   if (callObject.localMedia & rainbowSDK.Call.Media.VIDEO) {
            //     rainbowSDK.webRTC.displayLocalVideo(callObject);
            //   } else {
            //     rainbowSDK.webRTC.hideLocalVideo(callObject);
            //   }
        } else if (callObject.status.value === "Unknown") {
            // rainbowSDK.webRTC.hideLocalVideo();
            // rainbowSDK.webRTC.hideRemoteVideo(callObject);
            // call cancelled
            console.log("Call cancelled!");
            rainbowSDK.webRTC.release(callObject);
          
      }
    //   console.log(call);
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