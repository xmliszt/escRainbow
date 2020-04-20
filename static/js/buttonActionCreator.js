import {waitSeconds} from "./../js/timeUtil.js";
import {generateSendBubble, generateResponseBubble, generateResponseBubbleWithInsertionElements} from "./../js/bubbleGenerator.js";

function createCallbackResponseForButton(identifier, callback) {
    $(identifier).click(function () {
        generateSendBubble($(identifier).html());
        waitSeconds(1, callback);
    });
}

function createResponseMessageForButton(identifier, responseMsg, from, query) {
    $(identifier).click(function () {
        generateSendBubble($(identifier).html());
        setTimeout(generateResponseBubble.bind(this, responseMsg, from), 1000);
        var current_query = localStorage.getItem("userQuery");
        console.log("Query set to " + current_query);
    });
}

function createResponseMessageWithChoicesForButton(identifier, responseMsg, from, choices) {
    $(identifier).click(function () {
        generateSendBubble($(identifier).html());
        setTimeout(generateResponseBubbleWithInsertionElements.bind(this, responseMsg, from, choices), 1000);
    });
}

function createResponseWithAjaxForButton(identifier, responseMsg, from, method, url, data, callback) {
    $(identifier).click(function () {
        generateSendBubble($(identifier).html());
        setTimeout(generateResponseBubble.bind(this, responseMsg, from), 1000);
        $.ajax({
            type: method,
            url: url,
            data: data,
            success: callback
        });
    });
}

export {
    createCallbackResponseForButton,
    createResponseMessageForButton,
    createResponseMessageWithChoicesForButton,
    createResponseWithAjaxForButton
}