const { reqApiNoSign } = require('../api/client')

var shopBean = {
    queryTaskIndex: async (axios, options) => {
        let data = await reqApiNoSign(axios, {
            ...options,
            functionId: 'queryTaskIndex',
            body: {}
        })
        return data.data?.nextTaskList || []
    },
    takeTask: async (axios, options) => {
        const { taskId } = options
        let data = await reqApiNoSign(axios, {
            ...options,
            functionId: 'takeTask',
            body: { 'taskId': taskId }
        })
        console.log(data)
    },
    doTask: async (axios, options) => {
        let tasks = await shopBean.queryTaskIndex(axios, options)
        let willtasks = tasks.filter(t => t.taskStatus === 4)
        for (let task of willtasks) {
            console.info('将浏览店铺', task.shopName)
            await shopBean.takeTask(axios, {
                ...options,
                taskId: task.taskId
            })
            await new Promise((resolve, reject) => setTimeout(resolve, 1 * 1000))
        }
    }
}
module.exports = shopBean