import rainbowSDK from './rainbow-sdk.min.js';
import { sendReminderForInactivity, stopTimeOutEvent, startTimeOutForDisconnection, startTimeOutForTerminateCallAgent } from './timeUtil.js';
import { disconnect } from './agentConnUtils';
import { cancelAgentCall } from './bubbleGenerator.js';
jest.mock("./rainbow-sdk.min.js", ()=>({
    default: () => "mock rainbow",
}));

beforeEach(()=>{
    jest.useFakeTimers();
    jest.mock("./agentConnUtils.js");
    jest.mock("./bubbleGenerator.js");
});

afterEach(()=>{
    jest.clearAllTimers();
});

describe('test the waitSeconds function', () => {
    it('should call the callback after specified number of seconds', () => {
        var cb = jest.fn();
        const waitSeconds = require("./timeUtil").waitSeconds;
        waitSeconds(1, cb);
        jest.runAllTimers();
        expect(cb).toBeCalled();
        expect(cb).toHaveBeenCalledTimes(1);
    });
});

describe('test the start timeout for reminder function', () => {
    
    it('should set time out for "sendReminderForInactivity" funciton for specified minutes', () => {
        const startTimeOutForReminder = require("./timeUtil").startTimeOutForReminder;
        startTimeOutForReminder(1);
        expect(setTimeout).toBeCalled();
        expect(setTimeout).toHaveBeenCalledWith(sendReminderForInactivity, 1*60*1000);
    });
});

describe('test the stop timeout events function', () => {
    it('should call clearTimeout twice to clear the two timeout events', () => {
        stopTimeOutEvent();
        expect(clearTimeout).toBeCalled();
        expect(clearTimeout).toHaveBeenCalledTimes(2);
    });
});

describe('test the start timeout for disconnection', () => {
    it('should set timeout event for disconnect function for specified minutes', () => {
        startTimeOutForDisconnection(1);
        expect(setTimeout).toBeCalled();
        expect(setTimeout).toHaveBeenCalledWith(disconnect, 1*60*1000);
        jest.runAllTimers();

    });
});

describe('test the start timeout for terminate call agent function', () => {    
    it('should set timeout for both generate reminder bubble funciton and cancel agent call function', () => {
        startTimeOutForTerminateCallAgent(1);
        expect(setTimeout).toHaveBeenCalledTimes(2);
        expect(setTimeout).toHaveBeenNthCalledWith(1, expect.any(Function), 0.5*60*1000);
        expect(setTimeout).toHaveBeenNthCalledWith(2, cancelAgentCall, 1*60*1000);
    });
});

describe('test the send reminder for inactivity function', () => {
    it('should call three functions one by one', () => {
        jest.dontMock('jquery');
        global.$ = require("jquery");
        document.body.innerHTML = `<div id="conversation_body"></div>`;
        sendReminderForInactivity();
        var element = document.getElementById('conversation_body');
        expect(element.innerHTML).toBeDefined();
        expect(element.scrollTop).toBe(element.scrollHeight);
    });
});