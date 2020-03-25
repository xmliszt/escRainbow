// import getDateTime from "./elementUtils.js";
const { getPartFromURL, getDateTime } = require("./elementsUtils.js");

describe("getPartFromURL functin", () => {
  test("it should get part from URL", () => {
    const url =
      "https://developer.mozilla.org/en-US/docs/Web/API/URL/pathname?q=value";
    const part = "en-US/docs/Web/API/URL/pathname?q=value";
    const output1 = "en-US";
    const output2 = "pathname";

    // first test case
    expect(getPartFromURL(url, 1)).toEqual(output1);
    // second test case
    expect(getPartFromURL(url, 6)).toEqual(output2);
  });
});

describe("getDateTime function", () => {
  test("it should get date time", () => {
    var today = new Date();
    var date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    var time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + " " + time;

    const output1 = "2020-3-25" + " " + time; // expected output
    const output2 = date + " " + time; // expected output

    // first test case
    expect(getDateTime()).toEqual(output1); // makes actual test

    // second test case
    expect(getDateTime()).toEqual(output2); // makes actual test
  });
});
