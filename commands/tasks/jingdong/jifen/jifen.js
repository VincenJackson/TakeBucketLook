const { w } = require("../sign/common")
var jifen = {
    // 京东积分
    jd_jf_sign: async (axios, options) => {
        let params = {
            t: Math.ceil(Date.now() / 1000)
        }
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "referer": 'https://prodev.m.jd.com/mall/active/eEcYM32eezJB7YX4SBihziJCiGV/index.html'
            },
            url: `https://dwapp.jd.com/user/sign?` + w(params),
            method: 'get'
        })
        console.log(data)
    },
}
module.exports = jifen