const {waitSeconds, getPartFromURL, getDateTime} = require("./elementsUtils.js");

// test for waitSeconds
jest.useFakeTimers();
describe("waitSeconds function", () => {
    test("it should wait for a second", () => {
        const callback = jest.fn();

        waitSeconds(1, callback);

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

// test for getPartFromURL
describe("getPartFromURL function", () => {
    test("it should get part from URL", () => {
        const url = "https://developer.mozilla.org/en-US/docs/Web/API/URL/pathname?q=value";
        const part = "en-US/docs/Web/API/URL/pathname?q=value";
        const output1 = "en-US";
        const output2 = "pathname";
        const output3 = undefined;

        // first test case
        expect(getPartFromURL(url, 1)).toEqual(output1);
        // second test case
        expect(getPartFromURL(url, 6)).toEqual(output2);
        // third test case
        expect(getPartFromURL(url, 10)).toEqual(output3);
    });
});

// test for getDateTime
describe("getDateTime function", () => {
    test("it should get date time", () => {
        var today = new Date();
        var date = today.getFullYear() + "-" + (
            today.getMonth() + 1
        ) + "-" + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + " " + time;

        const output1 = "2020-3-26" + " " + time;
        const output2 = date + " " + time;

        // first test case
        expect(getDateTime()).toEqual(output1);

        // second test case
        expect(getDateTime()).toEqual(output2);
    });
});
