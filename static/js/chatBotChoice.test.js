import rainbowSDK from './rainbow-sdk.min.js';
jest.mock("./rainbow-sdk.min.js", ()=>({
    default: () => "mock rainbow",
}));
import * as element from "./chatBotChoice";

afterEach(()=>{
    jest.clearAllMocks();
});

describe('test for function that generates choices bubble', () => {
    
    jest.dontMock("jquery");
    jest.dontMock("fs");
    global.$ = require("jquery");

    document.body.innerHTML = '<div id="conversation_body"></div>';

   
    it('should append a message bubble to conversation body', () => {
        jest.mock("./elementsUtils.js");
        jest.mock("./chatBotChoice.js");
        const mockGetDateTime = require("./elementsUtils").getDateTime;
        const mockScrollToBottom = require("./elementsUtils").scrollToBottom;
        const mockCreateCallbackResponseForButton = require("./elementsUtils").createCallbackResponseForButton;
        const mockGenerateBotChoicesBubble = require("./chatBotChoice").generateBotChoicesBubble;

        var testBubble = $('<div>something</div>');
        mockGenerateBotChoicesBubble.mockImplementation(()=>{
            mockGetDateTime();
            $('#conversation_body').append(testBubble);
            mockScrollToBottom();
            mockCreateCallbackResponseForButton('#test1', jest.fn);
            mockCreateCallbackResponseForButton('#test2', jest.fn);
            mockCreateCallbackResponseForButton('#test3', jest.fn);
            mockCreateCallbackResponseForButton('#test4', jest.fn);
        });

        mockGenerateBotChoicesBubble();
        expect(mockGetDateTime).toHaveBeenCalled();
        expect(mockScrollToBottom).toHaveBeenCalled();
        expect(mockCreateCallbackResponseForButton).toHaveBeenCalledTimes(4);
    });
});