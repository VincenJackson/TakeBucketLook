const { w } = require("../sign/common")

var task = {
    doTask: async (axios, options) => {
        const { task, token } = options
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": `https://lkyl.dianpusoft.cn`,
                token,
                "referer": `https://lkyl.dianpusoft.cn/client`,
            },
            url: `https://lkyl.dianpusoft.cn/api/ssjj-task-record/browseChannels/${task.ssjjTaskInfo.id}/${task.browseId}?` + w({
                body: '{}'
            }),
            method: 'get'
        })
        if (data.head.code === 200) {
            console.info(data.head.msg)
        } else {
            console.error(data.head.msg)
        }
    },
}

module.exports = task