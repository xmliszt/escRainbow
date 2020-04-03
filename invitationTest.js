const f = async () =>{
    // Rainbow Node SDK
    // Load the SDK
    let RainbowSDK = require("./node_modules/rainbow-node-sdk");
    // Load the credentials
    let Credentials = require("./static/js/credentials.js");
    // Instantiate the SDK
    let rainbowSDK = new RainbowSDK(Credentials.cred);
    // Start the SDK
    await rainbowSDK.start();
    rainbowSDK.events.on('rainbow_onready', function () { // do something when the SDK is connected to Rainbow
        console.log("Rainbow is ready!")
    });
    rainbowSDK.events.on('rainbow_onerror', function (err) { // do something when something goes wrong
        console.error("Something wrong!")
    });
    try{
        await rainbowSDK.invitations.sendInvitationByEmail("agent6@alpha.com");
    } catch(e){
        console.log(e.error.errorDetails[0]);
    }
}

f();
