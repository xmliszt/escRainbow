function botTextResponse(message){
    if (message.toLowerCase() == "help"){
        generateBotChoicesBubble();
        return;
    } else if (message.toLowerCase().includes("hello")){
        generateResponseBubble("Hello there!", 0);
        return;
    } 
    else {
        // send message to backend to be sent to rainbow service and get a response message back
        createAjax("POST", window.location.href, {message:message}, function(data, status, els){
            console.log(`${status}: Receive response: ${data.response}`);
            var responseMsg = data.response.toString();
            var responseBody = data.from;
            console.log(`${responseMsg} ${responseBody}`);
            setTimeout(function(){generateResponseBubble(responseMsg, responseBody);}, 1000);
        });
        return;
    }
}