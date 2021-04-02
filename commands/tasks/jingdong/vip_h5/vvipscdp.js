const { transParams, w } = require('../sign/common')
var vvipscdp = {
    vvipscdp_raffle_auto_send_bean: async (axios, options) => {
        let params = {
            'appid': 'lottery_drew',
            functionId: 'vvipscdp_raffle_auto_send_bean',
            body: JSON.stringify({ "channelCode": "scdp_system_id" }),
            _: Date.now(),
        }
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "Referer": "https://lottery.m.jd.com/",
            },
            url: `https://api.m.jd.com/?` + w(params),
            method: 'get'
        })
        if (data.data.sendBeanFlag) {
            console.reward('京豆', data.data.sendBeanAmount)
        }
    },
}

module.exports = vvipscdp