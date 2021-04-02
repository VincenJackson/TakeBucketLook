const { lks_sign, transParams, w } = require('./signUtils')
const { msg } = require('./common')
var FollowChannel = {
    doTask: async (axios, options) => {
        const { task, pet } = options
        console.log(`开始完成【${task.taskName}】任务中`)
        const { channels } = await FollowChannel.FllowChannelList(axios, options)
        let willchannels = channels.filter(g => g.status === false)
        for (let channel of willchannels) {
            await FollowChannel.followchannelstart(axios, {
                ...options,
                channel
            })
            await new Promise((resolve, reject) => setTimeout(resolve, 5 * 1000))
            await FollowChannel.followChannelEnd(axios, {
                ...options,
                channel
            })
            await new Promise((resolve, reject) => setTimeout(resolve, 5 * 1000))
            await require('../api/channel').DelChannelFav(axios, {
                ...options,
                channel
            })
        }
        if (willchannels.length) {
            let tasks = await pet.getPetTaskConfig(axios, options)
            let tasknew = tasks.find(t => t.taskType === task.taskType)
            console.log(`任务进度${tasknew.joinedCount || 0}/${tasknew.taskChance}`)
        }
    },
    FllowChannelList: async (axios, options) => {
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
            url: `https://jdjoy.jd.com/common/pet/getFollowChannels?` + w(params),
            method: 'get'
        })

        if (data.success) {
            console.log('加载任务配置成功')
            return {
                channels: data.datas
            }
        } else {
            console.error('加载任务配置失败', data.errorMessage)
            return { channels: [] }
        }
    },
    followchannelstart: async (axios, options) => {
        const { channel } = options
        let lkt = Date.now()
        let params = {
            'reqSource': 'h5',
            'lks': lks_sign(lkt),
            'lkt': lkt,
            'iconCode': 'follow_channel',
            'linkAddr': channel.channelId
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
            console.info(`进入频道[${channel.channelName}]成功`)
        } else {
            console.error(`进入频道[${channel.channelName}]失败`, data.errorMessage)
        }
    },
    followChannelEnd: async (axios, options) => {
        const { channel } = options
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
                channelId: channel.channelId,
                taskType: "FollowChannel"
            }
        })
        if (data.success) {
            if (data.errorCode === 'follow_success') {
                console.info(`浏览频道[${channel.channelName}]成功`)
            } else {
                console.error(`浏览频道[${channel.channelName}}]失败`, msg[data.errorCode])
            }
        } else {
            console.error(`浏览频道[${channel.channelName}}]失败`, data.errorMessage)
        }
    }
}
module.exports = FollowChannel