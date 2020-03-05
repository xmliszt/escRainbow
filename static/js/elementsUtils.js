function generateButton(id, content, btn_value){
    var element = 
        `<button class="btn btn-sm btn-dark" style="margin: 5" id="${id}" value="${btn_value}">${content}</button>`
    ;
    return element;
}

exports.elementUtils = {
    generateBtn: generateButton
}