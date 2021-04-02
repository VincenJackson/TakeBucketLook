const { reqApiNoSign } = require('../api/client')
const { parseCookie } = require('../../../../utils/util')

var findBean = {
    queryCouponInfo: async (axios, options) => {
        let data = await reqApiNoSign(axios, {
            ...options,
            functionId: 'queryCouponInfo',
            body: {}
        })
        return [data.data?.couponTaskInfo]
    },
    beanTaskList: async (axios, options) => {
        let data = await reqApiNoSign(axios, {
            ...options,
            functionId: 'beanTaskList',
            body: {}
        })
        return data.data?.taskInfos || []
    },
    sceneGetCoupon: async (axios, options) => {
        let cookies = parseCookie(options.cookies, ['3AB9D23F7A4B3C9B'])
        let data = await reqApiNoSign(axios, {
            ...options,
            functionId: 'sceneGetCoupon',
            body: {
                "eid": cookies['3AB9D23F7A4B3C9B'],
                "fp": "-1",
                "jda": "-1",
                "referUrl": "-1",
                "rnVersion": "4.7",
                "shshshfp": "-1",
                "shshshfpa": "-1",
                "userAgent": "-1"
            }
        })
        if (data.data.bizCode == "0") {
            console.info('累计成长值', data.data.growthResult.growth, '本次获得', data.data.growthResult.addedGrowth)
        }
    },
    beanDoTask: async (axios, options) => {
        const { task, actionType } = options
        let data = await reqApiNoSign(axios, {
            ...options,
            functionId: 'beanDoTask',
            body: { "actionType": actionType, "taskToken": task.taskToken }
        })
        if (data.data?.bizCode == "0") {
            console.info(data.data)
            if (data.data.growthResult) {
                console.info('累计成长值', data.data.growthResult.growth, '本次获得', data.data.growthResult.addedGrowth)
            }
        } else {
            console.error(data.data?.bizMsg)
        }
    },
    doTask: async (axios, options) => {

        let tasks = await findBean.queryCouponInfo(axios, options)
        let willtasks = tasks.filter(t => !t.awardFlag)
        for (let task of willtasks) {
            await findBean.sceneGetCoupon(axios, options)
        }

        tasks = await findBean.beanTaskList(axios, options)
        willtasks = tasks.filter(t => t.status === 1)
        for (let task of willtasks) {
            console.info('完成任务中', task.taskName)
            let tt0 = task
            let n = tt0.maxTimes - parseInt(tt0.times)
            while (n > 0) {
                for (let tt of tt0.subTaskVOS) {
                    if ([8, 9].indexOf(tt0.taskType) !== -1) {
                        await findBean.beanDoTask(axios, {
                            ...options,
                            task: tt,
                            actionType: 1
                        })
                        await new Promise((resolve, reject) => setTimeout(resolve, 6 * 1000))
                    }
                    await findBean.beanDoTask(axios, {
                        ...options,
                        task: tt,
                        actionType: 0
                    })
                    await new Promise((resolve, reject) => setTimeout(resolve, 1 * 1000))
                }
                let ttt = await findBean.beanTaskList(axios, options)
                tt0 = ttt.find(t => t.taskId == tt0.taskId)
                n--
            }
        }
    }
}
module.exports = findBean