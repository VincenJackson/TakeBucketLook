const { transParams, w } = require('../sign/common')
const { parseCookie } = require('../../../../utils/util')

var daojia = {
    passport: async (axios, options) => {
        let params = {
            _jdrandom: Date.now() + '',
            functionId: 'login/passport',
            body: '{"returnLink": "https://daojia.jd.com/html/index.html?channel=jdapp#user"}',
            // city_id: '2144'
        }
        let { data, config } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "Referer": "https://daojia.jd.com/taroh5/h5dist/",
            },
            url: `https://daojia.jd.com/client?` + w(params),
            method: 'get'
        })
        return {
            jar: config.jar
        }
    },
    dosign: async (axios, options) => {
        const { body } = options
        let { jar } = await daojia.passport(axios, options)
        let params = {
            _jdrandom: Date.now() + '',
            functionId: 'signin/userSigninNew',
            isNeedDealError: 'true',
            body: JSON.stringify(body),
            // city_id: '2144',
            channel: 'h5',
            platform: '6.6.0',
            platCode: 'h5',
            appVersion: '6.6.0',
            appName: 'paidaojia',
            deviceModel: 'appmodel'
        }
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "Referer": "https://daojia.jd.com/taroh5/h5dist/",
            },
            jar,
            url: `https://daojia.jd.com/client?` + w(params),
            method: 'get'
        })

        if (data.code === '0') {
            console.info('获得鲜豆', data.result.points)
        } else {
            console.error(data.msg)
        }
    },
    getTasks: async (axios, options) => {
        const { modelId } = options
        let params = {
            _jdrandom: Date.now() + '',
            functionId: 'task/list',
            isNeedDealError: 'true',
            body: JSON.stringify({ "modelId": modelId, "plateCode": 3 }),
            // city_id: '2144',
            channel: 'h5',
            platform: '6.6.0',
            platCode: 'h5',
            appVersion: '6.6.0',
            appName: 'paidaojia',
            deviceModel: 'appmodel'
        }
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "Referer": "https://daojia.jd.com/taroh5/h5dist/",
            },
            url: `https://daojia.jd.com/client?` + w(params),
            method: 'get'
        })

        return data.result.taskInfoList
    },
    receivedTask: async (axios, options) => {
        const { task } = options
        let params = {
            _jdrandom: Date.now() + '',
            functionId: 'task/received',
            isNeedDealError: 'true',
            body: JSON.stringify({ "modelId": task.modelId, "taskId": task.taskId, "taskType": task.taskType, "plateCode": 3 }),
            // city_id: '2144',
            channel: 'h5',
            platform: '6.6.0',
            platCode: 'h5',
            appVersion: '6.6.0',
            appName: 'paidaojia',
            deviceModel: 'appmodel'
        }
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "Referer": "https://daojia.jd.com/taroh5/h5dist/",
            },
            url: `https://daojia.jd.com/client?` + w(params),
            method: 'get'
        })
        console.info(data)
    },
    finishedTask: async (axios, options) => {
        const { task } = options
        let params = {
            _jdrandom: Date.now() + '',
            functionId: 'task/finished',
            isNeedDealError: 'true',
            body: JSON.stringify({ "modelId": task.modelId, "taskId": task.taskId, "taskType": task.taskType, "plateCode": 3 }),
            // city_id: '2144',
            channel: 'h5',
            platform: '6.6.0',
            platCode: 'h5',
            appVersion: '6.6.0',
            appName: 'paidaojia',
            deviceModel: 'appmodel'
        }
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "Referer": "https://daojia.jd.com/taroh5/h5dist/",
            },
            url: `https://daojia.jd.com/client?` + w(params),
            method: 'get'
        })
        if (data.code === '0') {
            console.info('完成任务')
        } else {
            console.error(data.msg)
        }
    },
    sendPrizeTask: async (axios, options) => {
        const { task } = options
        let params = {
            _jdrandom: Date.now() + '',
            functionId: 'task/sendPrize',
            isNeedDealError: 'true',
            body: JSON.stringify({
                "modelId": task.modelId,
                "taskId": task.taskId,
                "taskType": task.taskType,
                "plateCode": 3,
                "subNode": task.node || ''
            }),
            // city_id: '2144',
            channel: 'h5',
            platform: '6.6.0',
            platCode: 'h5',
            appVersion: '6.6.0',
            appName: 'paidaojia',
            deviceModel: 'appmodel'
        }
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "Referer": "https://daojia.jd.com/taroh5/h5dist/",
            },
            url: `https://daojia.jd.com/client?` + w(params),
            method: 'get'
        })
        if (data.code === '0') {
            console.info('获得鲜豆', data.result.awardValue || 0)
        } else {
            console.error(data.msg)
        }
    },
    completeTasks: async (axios, options) => {
        await daojia.passport(axios, options)
        let tasks = await daojia.getTasks(axios, {
            ...options,
            modelId: 'M10003'
        })
        let tasks1 = await daojia.getTasks(axios, {
            ...options,
            modelId: 'M10001'
        })
        tasks = [...tasks, ...tasks1].filter(t => t.status === 1)
        for (let task of tasks) {
            console.info(task.taskType, task.taskName, `任务进度${task.finishNum}/${task.totalNum}`)
            if ([513, 506, 303, 401].indexOf(task.taskType) !== -1) {
                console.error('跳过')
                continue
            }
            if ([311, 502, 901, 505, 508].indexOf(task.taskType) === -1) {
                await daojia.receivedTask(axios, {
                    ...options,
                    task
                })
            }
            if (task.browseTime > 0) {
                await new Promise((resolve, reject) => setTimeout(resolve, task.browseTime * 1000 + Math.floor(Math.random() * 5) * 1000))
            }
            await daojia.finishedTask(axios, {
                ...options,
                task
            })
            if (task.totalNum === task.finishNum) {
                await daojia.sendPrizeTask(axios, {
                    ...options,
                    task
                })
            }
            if (task.subList) {
                for (let tt of task.subList) {
                    await daojia.sendPrizeTask(axios, {
                        ...options,
                        task: {
                            ...task,
                            ...tt
                        }
                    })
                    await new Promise((resolve, reject) => setTimeout(resolve, 2 * 1000))
                }
            }
            await new Promise((resolve, reject) => setTimeout(resolve, 5 * 1000))
        }
    }
}

module.exports = daojia