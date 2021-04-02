const { transParams, getFp, w } = require('../sign/common')
const { parseCookie } = require('../../../../utils/util')
var ttte = {
    DailySignIn: async (axios, options) => {
        let cookies = parseCookie(options.cookies, ['3AB9D23F7A4B3C9B'])
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": "https://active.jd.com",
                "referer": 'https://active.jd.com/forever/btgoose/?channelLv=sqbanner'
            },
            url: `https://ms.jr.jd.com/gw/generic/uc/h5/m/toDailySignIn?` + w({
                reqData: JSON.stringify(
                    {
                        channelLv: "sqbanner",
                        environment: "jdApp",
                        riskDeviceInfo: JSON.stringify({
                            "fp": getFp(axios, options),
                            "eid": cookies['3AB9D23F7A4B3C9B'],
                            "token": ""
                        }),
                        shareUuid: ""
                    }
                )
            }),
            method: 'get'
        })
        if (data.resultData?.data?.signAward) {
            console.info('签到成功 获得鹅蛋', data.resultData?.data?.signAward)
        } else {
            console.error('签到失败', data.resultData)
        }
    },
    toDailyHome: async (axios, options) => {
        let cookies = parseCookie(options.cookies, ['3AB9D23F7A4B3C9B'])
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": "https://active.jd.com",
                "referer": 'https://active.jd.com/forever/btgoose/?channelLv=sqbanner'
            },
            url: `https://ms.jr.jd.com/gw/generic/uc/h5/m/toDailyHome?` + w({
                reqData: JSON.stringify(
                    {
                        channelLv: "sqbanner",
                        environment: "jdApp",
                        riskDeviceInfo: JSON.stringify({
                            "fp": getFp(axios, options),
                            "eid": cookies['3AB9D23F7A4B3C9B'],
                            "token": ""
                        }),
                        shareUuid: "",
                        timeSign: 0.860966079837957
                    }
                )
            }),
            method: 'get'
        })
        return data.resultData?.data || {}
    },
    toWithdraw: async (axios, options) => {
        let cookies = parseCookie(options.cookies, ['3AB9D23F7A4B3C9B'])
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": "https://active.jd.com",
                "referer": 'https://active.jd.com/forever/btgoose/?channelLv=sqbanner'
            },
            url: `https://ms.jr.jd.com/gw/generic/uc/h5/m/toWithdraw?` + w({
                reqData: JSON.stringify(
                    {
                        channelLv: "sqbanner",
                        environment: "jdApp",
                        riskDeviceInfo: JSON.stringify({
                            "fp": getFp(axios, options),
                            "eid": cookies['3AB9D23F7A4B3C9B'],
                            "token": ""
                        }),
                        shareUuid: "",
                        timeSign: 0.860966079837957
                    }
                )
            }),
            method: 'get'
        })
        if (data.resultData?.data?.result) {
            console.info('收取成功 累计鹅蛋', data.resultData?.data?.eggTotal)
        } else {
            console.error('收取失败', data.resultData)
        }
    },
    collectEgg: async (axios, options) => {
        let time = 1 * 3600
        console.info('开始收集鹅蛋')
        do {
            let { nextEggTime } = await ttte.toDailyHome(axios, options)
            console.log('等待', nextEggTime, 's')
            await new Promise((resolve, reject) => setTimeout(resolve, nextEggTime * 1000))
            await ttte.toWithdraw(axios, options)
            time -= nextEggTime
        } while (time > 0)
        console.info('休息一会儿吧')
    }
}
module.exports = ttte