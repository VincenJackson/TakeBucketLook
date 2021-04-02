const { lks_sign, transParams, w } = require('./signUtils')
const { TryNextEvent } = require('../../../../utils/EnumError')
const { msg } = require('./common')
const moment = require('moment')

var HelpFeed = {
    getFriends: async (axios, options) => {
        let lkt = Date.now()
        let params = {
            'reqSource': 'h5',
            'lks': lks_sign(lkt),
            'lkt': lkt,
            'itemsPerPage': 20,
            'currentPage': 1
        }
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": "https://h5.m.jd.com",
                "referer": `https://h5.m.jd.com/`,
            },
            url: `https://jdjoy.jd.com/common/pet/h5/getFriends?` + w(params),
            method: 'get'
        })
        if (data.success) {
            console.log('加载任务配置成功')
            return {
                friends: (data.datas || []).filter(d => d.food !== null)
            }
        } else {
            console.error('加载任务配置失败', data.errorMessage)
            return { friends: [] }
        }
    },
    friendstart: async (axios, options) => {
        const { friend } = options
        let lkt = Date.now()
        let params = {
            'reqSource': 'h5',
            'lks': lks_sign(lkt),
            'lkt': lkt,
            'iconCode': 'help_feed'
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
            console.info(`开始帮好友[${friend.friendName}]喂养`)
        } else {
            console.error(`开始帮好友[${friend.friendName}]喂养`, data.errorMessage)
        }
    },
    friendend: async (axios, options) => {
        const { friend } = options
        let lkt = Date.now()
        let params = {
            'reqSource': 'h5',
            'lks': lks_sign(lkt),
            'lkt': lkt,
            'friendPin': friend.friendPin
        }
        console.log(params)
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": "https://h5.m.jd.com",
                "referer": `https://h5.m.jd.com/`,
            },
            url: `https://jdjoy.jd.com/common/pet/helpFeed?` + w(params),
            method: 'get'
        })
        if (data.success) {
            console.info(`帮好友[${friend.friendName}]喂养成功`)
        } else {
            console.error(`帮好友[${friend.friendName}]喂养失败`, data.errorMessage)
        }
    },
    doTask: async (axios, options) => {
        const { task, pet } = options
        console.log(`开始完成【${task.taskName}】任务中`)

        const { friends } = await HelpFeed.getFriends(axios, options)
        let willfriends = friends.filter(g => g.status === 'not_feed')
        if (!willfriends.length) {
            console.log('没有可以喂养的')
        }
        for (let friend of willfriends) {
            await HelpFeed.friendstart(axios, {
                ...options,
                friend
            })
            await new Promise((resolve, reject) => setTimeout(resolve, 5 * 1000))
            await HelpFeed.friendend(axios, {
                ...options,
                friend
            })
        }

        if (willfriends.length) {

            await pet.getFood(axios, {
                ...options,
                taskType: 'HelpFeed'
            })

            let tasks = await pet.getPetTaskConfig(axios, options)
            let tasknew = tasks.find(t => t.taskType === task.taskType)
            console.log(`任务进度${tasknew.joinedCount || 0}/${tasknew.taskChance}`)
            let nextTime = moment().add('3', 'hours')
            throw new TryNextEvent(JSON.stringify({
                message: '下一轮再次尝试喂养 ' + nextTime.format('YYYY-MM-DD HH:mm:ss'),
                relayTime: nextTime.diff(moment(), 'seconds')
            }))
        }
    }
}
module.exports = HelpFeed