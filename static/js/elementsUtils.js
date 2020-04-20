function getDateTime() {
    var today = new Date();
    var date = today.getFullYear() + "-" + (
        today.getMonth() + 1
    ) + "-" + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + " " + time;
    return dateTime;
}

function generateButton(id, content, btn_value) {
    var element = `<button class="btn btn-sm btn-dark" style="margin: 5" id="${id}" value="${btn_value}">${content}</button>`;
    return element;
}

export { 
    getDateTime,
    generateButton
};