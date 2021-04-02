const { lks_sign, transParams, w } = require('./signUtils')
const { msg } = require('./common')
var ScanMarket = {
    doTask: async (axios, options) => {
        const { task, pet } = options
        console.log(`开始完成【${task.taskName}】任务中`)
        let markets = task.scanMarketList
        let willmarkets = markets.filter(g => g.status === false)
        for (let market of willmarkets) {
            await ScanMarket.ScanMarketStart(axios, {
                ...options,
                market
            })
            await new Promise((resolve, reject) => setTimeout(resolve, 10 * 1000))
            await ScanMarket.ScanMarketEnd(axios, {
                ...options,
                market
            })
        }
        if (willmarkets.length) {
            let tasks = await pet.getPetTaskConfig(axios, options)
            let tasknew = tasks.find(t => t.taskType === task.taskType)
            console.log(`任务进度${tasknew.joinedCount || 0}/${tasknew.taskChance}`)
        }
    },
    ScanMarketStart: async (axios, options) => {
        const { market } = options
        let lkt = Date.now()
        let params = {
            'reqSource': 'h5',
            'lks': lks_sign(lkt),
            'lkt': lkt,
            'iconCode': 'scan_market',
            'linkAddr': market.marketLinkH5
        }
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": "https://h5.m.jd.com",
                "referer": `https://h5.m.jd.com/`,
            },
            url: `https://jdjoy.jd.com/common/pet/icon/click?` + w(params),
            method: 'get'
        })
        if (data.success) {
            console.info(`开始浏览店铺[${market.marketName}]成功`)
        } else {
            console.error(`开始浏览店铺[${market.marketName}]失败`, data.errorMessage)
        }
    },
    ScanMarketEnd: async (axios, options) => {
        const { market } = options
        let lkt = Date.now()
        let params = {
            'reqSource': 'h5',
            'lks': lks_sign(lkt),
            'lkt': lkt
        }
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": "https://h5.m.jd.com",
                "referer": `https://h5.m.jd.com/`,
            },
            url: `https://jdjoy.jd.com/common/pet/scan?` + w(params),
            method: 'POST',
            data: {
                "marketLink": market.marketLinkH5,
                "taskType": "ScanMarket"
            }
        })

        if (data.success) {
            if (data.errorCode === 'follow_success') {
                console.info(`完成浏览店铺【${market.marketName}】成功`)
            } else {
                console.error(`完成浏览店铺【${market.marketName}】失败`, msg[data.errorCode])
            }
        } else {
            console.error(`完成浏览店铺[${market.marketName}]失败`, data.errorMessage)
        }
    }
}
module.exports = ScanMarket