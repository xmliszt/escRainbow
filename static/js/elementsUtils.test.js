import rainbowSDK from './rainbow-sdk.min.js';
jest.mock("./rainbow-sdk.min.js", ()=>({
    default: () => "mock rainbow",
}));
import * as element from "./elementsUtils";

afterEach(()=>{
    jest.clearAllMocks();
});

jest.useFakeTimers();
describe("waitSeconds function", () => {
    test("it should wait for a second", () => {
        const callback = jest.fn();
        element.waitSeconds(1, callback);

        // At this point in time, the callback should not have been called yet
        expect(callback).not.toBeCalled();

        // execute all timers
        jest.runAllTimers();

        // call callback fuction
        expect(callback).toBeCalled();
        expect(callback).toHaveBeenCalledTimes(1);
    });
});
jest.clearAllTimers();

describe("getDateTime function", () => {
    test("it should get date time", () => {
        var today = new Date();
        var date = today.getFullYear() + "-" + (
            today.getMonth() + 1
        ) + "-" + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

        const output = date + " " + time;

        // test case
        expect(element.getDateTime()).toEqual(output);
    });
});


describe('test button generation', () => {
    test("it should create a button element", () => {
        var expected = `<button class="btn btn-sm btn-dark" style="margin: 5" id="test" value="0">test</button>`;
        var e = element.generateButton("test", "test", 0);
        expect(e).toEqual(expected);
    })
});

describe('test cancel agent call function', () => {

    it("three functions should be called once each", ()=>{
        jest.mock("./agentConnUtils.js");
        jest.mock("./elementsUtils.js");
        const mockStopTimeOutEvent = require("./elementsUtils").stopTimeOutEvent;
        const mockDisconnect = require("./agentConnUtils").disconnect;
        const mockGenerateResponseBubble = require("./elementsUtils").generateResponseBubble;
        const mockCancelAgentCall = require("./elementsUtils").cancelAgentCall;
        mockCancelAgentCall.mockImplementation(()=>{
            mockStopTimeOutEvent();
            mockDisconnect();
            mockGenerateResponseBubble();
        });
        mockStopTimeOutEvent.mockImplementation(jest.fn());
        mockDisconnect.mockImplementation(jest.fn());
        mockGenerateResponseBubble.mockImplementation(jest.fn());

        mockCancelAgentCall();
        expect(mockStopTimeOutEvent).toBeCalled();
        expect(mockDisconnect).toBeCalled();
        expect(mockGenerateResponseBubble).toBeCalled();
    })
})

jest.useFakeTimers();
describe('test start timeout event', () => {
    test('setTimeout should be called once and callback should be called after the timeout', () => {
        jest.mock("./elementsUtils.js");
        const mockStartTimeOutForReminder = require("./elementsUtils").startTimeOutForReminder;
        const mockFn = jest.fn();
        mockStartTimeOutForReminder.mockImplementationOnce((minutes)=>{
            setTimeout(mockFn, minutes*60*1000);
        });

        mockStartTimeOutForReminder(1);
        jest.runAllTimers();
        expect(mockFn).toBeCalled();
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1*60*1000);
        expect(setTimeout).toHaveBeenCalledTimes(1);
    });
});
jest.clearAllTimers();

describe('test for stop time out events', () => {
    it('clear time out should be called twice', () => {
        element.stopTimeOutEvent();
        expect(clearTimeout).toHaveBeenCalledTimes(2);
    });
});

jest.useFakeTimers();
describe('test for start time out for disconnection', () => {
    it('set time out is called once with correct interval, and then callback is called', () => {
        const cb = jest.fn();
        jest.mock("./elementsUtils.js");
        const mockStartTimeOutForDisconnection = require("./elementsUtils").startTimeOutForDisconnection;
        mockStartTimeOutForDisconnection.mockImplementation((minutes)=>{
            setTimeout(cb, minutes*60*1000)
        });

        mockStartTimeOutForDisconnection(1);
        expect(cb).toHaveBeenCalledTimes(0);
        jest.runAllTimers();
        expect(cb).toHaveBeenCalledTimes(1);
        expect(setTimeout).toHaveBeenCalledTimes(1);
        expect(setTimeout).toHaveBeenLastCalledWith(cb, 1*60*1000);

    });
});

jest.useFakeTimers();
describe('test start time out for terminate agent', () => {
    it('set time out is called twice, one callback called after 0.5min, the other called after minute as argument put in', () => {
        const cb = jest.fn();
        const cb2 = jest.fn();
        jest.mock("./elementsUtils.js");
        const mockStartTimeOutForTerminateCallAgent = require("./elementsUtils").startTimeOutForTerminateCallAgent;
        mockStartTimeOutForTerminateCallAgent.mockImplementation((minutes)=>{
            setTimeout(cb, 0.5*60*1000);
            setTimeout(cb2, minutes*60*1000);
        });

        mockStartTimeOutForTerminateCallAgent(1);
        expect(cb).toHaveBeenCalledTimes(0);
        expect(cb2).toHaveBeenCalledTimes(0);
        jest.runAllTimers();
        expect(cb).toHaveBeenCalledTimes(1);
        expect(cb2).toHaveBeenCalledTimes(1);
        expect(setTimeout).toHaveBeenCalledTimes(2);
        expect(setTimeout).toHaveBeenLastCalledWith(cb2, 1*60*1000);

    });
});
jest.clearAllTimers();

describe('test send reminder for activity function that call three functions', () => {
    it('three functions should be called once each', () => {
        jest.mock("./elementsUtils.js");
        const mockGenerateResponseBubbleForAgent = require("./elementsUtils").generateResponseBubbleForAgent;
        const mockStopTimeOutEvent = require("./elementsUtils").stopTimeOutEvent;
        const mockStartTimeOutForDisconnection = require("./elementsUtils").startTimeOutForDisconnection;
        const mockSendReminderForInactivity = require("./elementsUtils").sendReminderForInactivity;

        mockSendReminderForInactivity.mockImplementation(()=>{
            mockGenerateResponseBubbleForAgent("test", 0);
            mockStopTimeOutEvent();
            mockStartTimeOutForDisconnection(1);
        });

        mockSendReminderForInactivity();
        
        expect(mockGenerateResponseBubbleForAgent).toBeCalled();
        expect(mockStopTimeOutEvent).toBeCalled();
        expect(mockStartTimeOutForDisconnection).toBeCalled;
        expect(mockGenerateResponseBubbleForAgent).toHaveBeenLastCalledWith("test", 0);
        expect(mockStartTimeOutForDisconnection).toHaveBeenLastCalledWith(1);
    });
});

