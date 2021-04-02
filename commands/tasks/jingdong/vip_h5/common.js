const { transParams, w } = require('../sign/common')
var common = {
    reqApi: async (axios, options) => {
        const { appid, functionId, body } = options
        let params = {
            'appid': appid,
            functionId: functionId,
            body: JSON.stringify(body),
            t: Date.now(),
        }
        let result = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "Referer": "https://spa.jd.com/home",
            },
            url: `https://api.m.jd.com/?` + w(params),
            method: 'get'
        })
        return result
    }
}
module.exports = common