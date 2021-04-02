
const { w } = require('../sign/common')
// 关注频道
var task = {
    plantChannelTaskList: async (axios, options) => {
        let params = {
            functionId: 'plantChannelTaskList',
            body: JSON.stringify({}),
            appid: 'ld',
            client: 'android',
            clientVersion: '9.4.4',
            networkType: '',
            osVersion: '',
            uuid: ''
        }
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "referer": 'https://bean.m.jd.com/'
            },
            url: `https://api.m.jd.com/client.action?` + w(params),
            method: 'get'
        })
        return [...data.data.goodChannelList, ...data.data.normalChannelList]
    },
    plantChannelNutrientsTask: async (axios, options) => {
        const { channel } = options
        let params = {
            functionId: 'plantChannelNutrientsTask',
            body: JSON.stringify({ "channelTaskId": channel.channelTaskId + '', "channelId": channel.channelId + '' }),
            appid: 'ld',
            client: 'android',
            clientVersion: '9.4.4',
            networkType: '',
            osVersion: '',
            uuid: ''
        }
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "referer": 'https://bean.m.jd.com/'
            },
            url: `https://api.m.jd.com/client.action?` + w(params),
            method: 'get'
        })
        if (data.code === '0') {
            if (!data.errorCode) {
                let n = data.data.nutrState === '1' ? data.data.nutrCount : 0
                console.info('领取营养液成功', n)
                return n > 0 ? true : false
            } else {
                console.error('领取营养液失败', data.errorMessage)
            }
        } else {
            console.error('领取营养液失败', data)
        }
    },
    doTask: async (axios, options) => {
        let channels = await task.plantChannelTaskList(axios, options)
        channels = channels.filter(s => s.taskState === '2')
        console.info('剩余未完成频道', channels.length)

        // 3次有效即可
        let n = 0

        for (let channel of channels) {
            console.log('浏览频道', channel.channelName)
            let flag = await task.plantChannelNutrientsTask(axios, {
                ...options,
                channel
            })
            if (flag) {
                n++
            }
            await new Promise((resolve, reject) => setTimeout(resolve, 5 * 1000))

            if (n >= 3) {
                break
            }
        }

        if (channels.length) {
            return true
        }

    }
}

module.exports = task