var crypto = require('crypto');
var common = {
    builduts: (body, t) => {
        var e
        return t = t.toString().substr(0, 10),
            e = JSON.stringify(body) || "",
            e = crypto.createHash("md5").update("aDvScBv$gGQvrXfva8dG!ZC@DA70Y%lX" + e + t, "utf8").digest("hex"),
            e = e + Number(t).toString(16),
            e
    },
    buildparams: (body, appid, functionId) => {
        let t = Date.now()
        return {
            body: JSON.stringify(body) || "",
            uts: common.builduts(body, t),
            appid,
            functionId,
            t
        }
    }
}

module.exports = common