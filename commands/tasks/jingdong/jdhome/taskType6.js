const { w } = require("../sign/common")

var task4 = {
    queryChannelList: async (axios, options) => {
        const { task, token } = options
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": `https://lkyl.dianpusoft.cn`,
                token,
                "referer": `https://lkyl.dianpusoft.cn/client`,
            },
            url: `https://lkyl.dianpusoft.cn/api/ssjj-task-channel/queryChannelsList/${task.ssjjTaskInfo.id}?` + w({
                body: '{}'
            }),
            method: 'get'
        })
        if (data.head.code === 200) {
            return data.body
        } else {
            console.error(data.head.msg)
        }
    },
    followChannel: async (axios, options) => {
        const { task, token } = options
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": `https://lkyl.dianpusoft.cn`,
                token,
                "referer": `https://lkyl.dianpusoft.cn/client`,
            },
            url: `https://lkyl.dianpusoft.cn/api/ssjj-task-record/followChannel/${task.ssjjTaskInfo.id}?` + w({
                body: '{}'
            }),
            method: 'get'
        })
        if (data.head.code === 200) {
            console.info(data)
        } else {
            console.error(data.head.msg)
        }
    },
    doTask: async (axios, options) => {
        let channels = await task4.queryChannelList(axios, options)
        await task4.followChannel(axios, options)
        for (let channel of channels) {
            await require('../api/channel').DelChannelFav(axios, {
                ...options,
                channel
            })
            await new Promise((resolve, reject) => setTimeout(resolve, 2 * 1000))
        }
    },
}

module.exports = task4