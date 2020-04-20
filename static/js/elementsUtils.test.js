import * as element from "./elementsUtils";

afterEach(()=>{
    jest.clearAllMocks();
});

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
