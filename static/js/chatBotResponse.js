import {generateResponseBubble, generateBotChoicesBubble} from "./../js/bubbleGenerator.js";
import {waitSeconds} from "./../js/timeUtil.js";

function botTextResponse(message){
    if (message.toLowerCase() == "help"){
        waitSeconds(1, generateBotChoicesBubble);
        return;
    } else if (message.toLowerCase().includes("hello")){
        waitSeconds(1, generateResponseBubble.bind(this, "Hello There! How can I help you?", 0));
        return;
    } 
    else {
        waitSeconds(1, generateResponseBubble.bind(this, "Sorry I don't understand :( Try type 'help' to see what I can do for you!", 0));
        return;
    }
}

export {botTextResponse};