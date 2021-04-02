const { lks_sign, w } = require('./signUtils')
var ThreeMeals = {
    doTask: async (axios, options) => {
        const { task } = options
        let lkt = Date.now()
        let params = {
            'reqSource': 'h5',
            'lks': lks_sign(lkt),
            'lkt': lkt,
            'taskType': task.taskType
        }
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": "https://h5.m.jd.com",
                "referer": `https://h5.m.jd.com/`,
            },
            url: `https://jdjoy.jd.com/common/pet/getFood?` + w(params),
            method: 'get'
        })
        if (data.success) {
            console.log(`任务【${task.taskName}】完成成功`, data.errorCode)
        } else {
            console.log(`任务【${task.taskName}】完成失败`)
        }
    }
}
module.exports = ThreeMeals