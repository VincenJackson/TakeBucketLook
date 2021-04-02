var crypto = require('crypto');

var transParams = (data) => {
    let params = new URLSearchParams();
    for (let item in data) {
        params.append(item, data['' + item + '']);
    }
    return params;
};

function w() {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}
        , t = [];
    return Object.keys(e).forEach((function (a) {
        t.push("".concat(a, "=").concat(encodeURIComponent(e[a])))
    }
    )), t.join("&")
}


var signUtils = {
    lks_sign: (lkt) => {
        let d = '98c14c997fde50cc18bdefecfd48ceb7'
        return crypto.createHash("md5").update("_" + d + "_" + lkt, "utf8").digest("hex")
    },
    transParams,
    w
}
module.exports = signUtils