import rainbowSDK from './rainbow-sdk.min.js';
jest.mock("./rainbow-sdk.min.js", ()=>({
    default: () => "mock rainbow",
}));
import * as element from "./agentConnUtils";

afterEach(()=>{
    jest.clearAllMocks();
});

describe('test connect to agent function', () => {

    jest.dontMock("jquery");
    jest.dontMock("fs");
    global.$ = require("jquery");

    it('should fire an ajax call', () => {
        const ajaxSpy = jest.spyOn($, 'ajax');
        element.connectAgent();
        expect(ajaxSpy).toBeCalled();
    });
});

jest.useFakeTimers();
describe('test disconnect function', () => {
    it('should call clear time out', () => {
        element.disconnect();
        expect(clearTimeout).toBeCalled();
    });
});

describe('test cleanup function when conversation closed', () => {

    jest.dontMock("jquery");
    jest.dontMock("fs");
    global.$ = require("jquery");

    it('should fire ajax call as well as generate bot choice bubble', () => {
        jest.mock("./chatBotChoice.js");
        jest.mock("./agentConnUtils.js");
        const mockGenerateBotChoiceBubble = require("./chatBotChoice").generateBotChoicesBubble;
        const ajaxSpy = jest.spyOn($, 'ajax');
        const mockCleanUp = require("./agentConnUtils").cleanUpWhenConversationClosed;
        mockCleanUp.mockImplementation(()=>{
            mockGenerateBotChoiceBubble();
            $.ajax({});
        });
        mockCleanUp();
        expect(ajaxSpy).toBeCalled();
        expect(mockGenerateBotChoiceBubble).toBeCalled();
    });
});

describe('test call agent function', () => {
    jest.mock("./elementsUtils.js");
    jest.mock("./agentConnUtils.js");
    const mockSendBubble = require("./elementsUtils").generateSendBubble;
    const ajaxSpy = jest.spyOn($, 'ajax');
    const mockCallAgent = require("./agentConnUtils").callAgent;
    mockCallAgent.mockImplementation(()=>{
        mockSendBubble("test");
        $.ajax({});
    });
    mockCallAgent();
    expect(ajaxSpy).toBeCalled();
    expect(mockSendBubble).toBeCalledWith("test");
});