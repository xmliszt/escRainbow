function initialize(){
    /** Rainbow SDK Section */
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
      console.log(conversation);
      rainbowSDK.im.markMessageFromConversationAsRead(conversation, message);
      generateResponseBubbleForAgent(message.data, message.from.lastname + " " + message.from.firstname);
  };
  document.addEventListener(rainbowSDK.im.RAINBOW_ONNEWIMMESSAGERECEIVED, onMessageReceived);

  /* Listen to the SDK event RAINBOW_ONREADY */
  document.addEventListener(rainbowSDK.RAINBOW_ONREADY, onReady)

  /* Listen to the SDK event RAINBOW_ONLOADED */
  document.addEventListener(rainbowSDK.RAINBOW_ONLOADED, onLoaded)

  rainbowSDK.load();

  /** END OF RAINBOW SECTION */
}