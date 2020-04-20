import rainbowSDK from './rainbow-sdk.min.js';
import {cancelAgentCall, generateSendBubble} from "./bubbleGenerator";
jest.mock("./rainbow-sdk.min.js", ()=>({
    default: () => "mock rainbow",
}));

beforeEach(()=>{
    jest.useFakeTimers();
    jest.dontMock('jquery');
    global.$ = require("jquery");
    document.body.innerHTML = `
    <div id="conversation_body"></div>
    <span id="titleText>test</span>`;
});

afterEach(()=>{
    jest.clearAllTimers();
    document.body.innerHTML = ``;
});

describe('cancel agent call', () => {
    it('should stop time out, disconnect and generate response bubble', () => {
        cancelAgentCall();
        var element = document.getElementById('conversation_body');
        expect(element.innerHTML).toBeDefined();
        expect(element.scrollTop).toBe(element.scrollHeight);
    });
});
