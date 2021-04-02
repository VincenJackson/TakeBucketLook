const { TryNextEvent } = require('../../../../utils/EnumError')
const { lks_sign, w } = require('./signUtils')
const moment = require('moment')
var FeedEveryDay = {
    lastFeedTime: async (axios, options) => {
        const { feedNum } = options
        let lkt = Date.now()
        let params = {
            'invitePin': '',
            'reqSource': 'h5',
            'lks': lks_sign(lkt),
            'lkt': lkt,
            'feedCount': feedNum
        }
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": "https://h5.m.jd.com",
                "referer": `https://h5.m.jd.com/`,
            },
            url: `https://jdjoy.jd.com/common/pet/enterRoom/h5?` + w(params),
            method: 'post',
            data: {}
        })
        if (data.success) {
            console.log('查询最后喂养时间成功', moment.unix(Math.floor(data.data.lastFeedTime / 1000)).format('YYYY-MM-DD HH:mm:ss'))
            return Math.floor(data.data.lastFeedTime / 1000)
        } else {
            console.log(`查询最后喂养时间失败`)
        }
    },
    feed: async (axios, options) => {
        const { feedNum } = options
        let lkt = Date.now()
        let params = {
            'reqSource': 'h5',
            'lks': lks_sign(lkt),
            'lkt': lkt,
            'feedCount': feedNum
        }
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": "https://h5.m.jd.com",
                "referer": `https://h5.m.jd.com/`,
            },
            url: `https://jdjoy.jd.com/common/pet/feed?` + w(params),
            method: 'get'
        })
        if (data.success) {
            console.log(`喂狗粮成功`, data.errorCode)
            return data.errorCode
        } else {
            console.log(`喂狗粮失败`)
        }
    },
    doTask: async (axios, options) => {
        const { task } = options
        let time = await FeedEveryDay.lastFeedTime(axios, options)

        if (moment.unix(time).isBefore(moment().subtract('3', 'hours'), 'seconds')) {

            console.log(`喂养进度${task.feedTotal}/${task.feedAmount}`)
            let feedNum = 10
            let n = Math.ceil(task.feedAmount / feedNum)
            while (n > 0) {
                let res = await FeedEveryDay.feed(axios, {
                    ...options,
                    feedNum
                })
                if (res === 'time_error') {
                    break
                }
                await new Promise((resolve, reject) => setTimeout(resolve, 1 * 1000))
                n--
            }
            console.info(`【${task.taskName}】已完成`)
            throw new TryNextEvent(JSON.stringify({
                message: '等待下一轮喂养',
                relayTime: 3 * 3600
            }))

        } else {
            let nextTime = moment.unix(time).add('3', 'hours')
            throw new TryNextEvent(JSON.stringify({
                message: '还未到可以喂养的时间 ' + nextTime.format('YYYY-MM-DD HH:mm:ss'),
                relayTime: nextTime.diff(moment(), 'seconds')
            }))
        }
    }
}
module.exports = FeedEveryDay