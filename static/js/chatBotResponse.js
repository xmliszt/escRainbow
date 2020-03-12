function botTextResponse(message){
    if (message.toLowerCase() == "help"){
        waitSeconds(1, generateBotChoicesBubble);
        return;
    } else if (message.toLowerCase().includes("hello")){
        waitSeconds(1, generateResponseBubble.bind(this, "Hello There!", 0));
        return;
    } 
    else {
        waitSeconds(1, generateResponseBubble.bind(this, "Sample response", 0));
        return;
    }
}