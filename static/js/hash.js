function hashCode(s) {
    var l = s.length;
    var h = "";
    for (var i=0; i<l; i++){
        h += s.charAt(i).charCodeAt().toString() + "-";
    }
    return h.substring(0, h.length-1);
};

function rehashCode(h) {
    var s = ""
    var codeList = h.split("-");
    var l = codeList.length;
    for (var i=0; i<l; i++){
        var code = parseInt(codeList[i]);
        var char = String.fromCharCode(code);
        s += char;
    }
    return s;
}

exports.hash = hashCode;
exports.rehash = rehashCode;