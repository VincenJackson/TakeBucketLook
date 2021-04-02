const { w } = require("../sign/common")
const path = require('path')
const fs = require('fs-extra')

var jdfactory = {
    getTaskDetail: async (axios, options) => {
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": `https://h5.m.jd.com`,
                "referer": `https://h5.m.jd.com/babelDiy/Zeus/2uSsV2wHEkySvompfjB43nuKkcHp/index.html?babelChannel=ttt6`,
            },
            url: `https://api.m.jd.com/client.action?` + w({
                functionId: 'jdfactory_getTaskDetail',
                body: JSON.stringify({}),
                clientVersion: '9.4.4',
                client: 'wh5',
            }),
            method: 'post'
        })

        return data.data.result
    },
    collectScore: async (axios, options) => {
        const { taskToken } = options
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": `https://h5.m.jd.com`,
                "referer": `https://h5.m.jd.com/babelDiy/Zeus/2uSsV2wHEkySvompfjB43nuKkcHp/index.html?babelChannel=ttt6`,
            },
            url: `https://api.m.jd.com/client.action?` + w({
                functionId: 'jdfactory_collectScore',
                body: JSON.stringify({ "taskToken": taskToken }),
                clientVersion: '9.4.4',
                client: 'wh5',
            }),
            method: 'post'
        })
        if (data.code === 0) {
            if (data.data.bizCode == 0) {
                console.info('获得电力', data.data.result.score, '剩余电力', data.data.result.userScore)
            } else {
                console.error(data.data.bizMsg)
            }
        } else {
            console.error(data.msg)
        }
    },
    getHomeData: async (axios, options) => {
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": `https://h5.m.jd.com`,
                "referer": `https://h5.m.jd.com/babelDiy/Zeus/2uSsV2wHEkySvompfjB43nuKkcHp/index.html?babelChannel=ttt6`,
            },
            url: `https://api.m.jd.com/client.action?` + w({
                functionId: 'jdfactory_getHomeData',
                body: JSON.stringify({}),
                clientVersion: '9.4.4',
                client: 'wh5',
            }),
            method: 'post'
        })
        return data.data.result
    },
    addEnergy: async (axios, options) => {
        let { factoryInfo } = await jdfactory.getHomeData(axios, options)

        // 600 10分钟左右的差别
        let maxScore = Math.min(factoryInfo.totalScore, factoryInfo.batteryCapacity) - 600

        // 可使用 --jdfactoryMaxAddEnergy 来启用充电限制
        if (factoryInfo.remainScore <= maxScore && options.jdfactoryMaxAddEnergy) {
            console.error('你启用了限制充电，仅当蓄电池快满时再充电')
            return
        }

        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": `https://h5.m.jd.com`,
                "referer": `https://h5.m.jd.com/babelDiy/Zeus/2uSsV2wHEkySvompfjB43nuKkcHp/index.html?babelChannel=ttt6`,
            },
            url: `https://api.m.jd.com/client.action?` + w({
                functionId: 'jdfactory_addEnergy',
                body: JSON.stringify({}),
                clientVersion: '9.4.4',
                client: 'wh5',
            }),
            method: 'post'
        })
        if (data.code === 0) {
            if (data.data.bizCode == 0) {
                console.info('本次充电', data.data.result.addScore, '累计充电进度', `${data.data.result.alreadyUseScore}/${data.data.result.fullScore}`)
            } else {
                console.error(data.data.bizMsg)
            }
        } else {
            console.error(data.msg)
        }
    },
    collectElectricity: async (axios, options) => {
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": `https://h5.m.jd.com`,
                "referer": `https://h5.m.jd.com/babelDiy/Zeus/2uSsV2wHEkySvompfjB43nuKkcHp/index.html?babelChannel=ttt6`,
            },
            url: `https://api.m.jd.com/client.action?` + w({
                functionId: 'jdfactory_collectElectricity',
                body: JSON.stringify({}),
                clientVersion: '9.4.4',
                client: 'wh5',
            }),
            method: 'post'
        })
        if (data.code === 0) {
            if (data.data.bizCode == 0) {
                console.info('本次发电收集', data.data.result.electricityValue, '当前电量', `${data.data.result.batteryValue}`)
            } else {
                console.error(data.data.bizMsg)
            }
        } else {
            console.error(data.msg)
        }
    },
    doXunChang: async (axios, options) => {
        await jdfactory.collectScore(axios, {
            ...options,
            taskToken: "P22v_x2QR8a90nTJx38k_EIcACjVWnYaY5jQ"
        })
    },
    doShuMa: async (axios, options) => {
        await jdfactory.collectScore(axios, {
            ...options,
            taskToken: "P22v_x2QR8a90nTJx38k_EIcACjVWnYaT5jQ"
        })
    },
    doTask: async (axios, options) => {
        let { factoryInfo, haveProduct } = await jdfactory.getHomeData(axios, options)
        if (haveProduct == 2) {
            console.error('你还没有选择需要生产的商品')
            return
        } else if (haveProduct == 1) {
            console.info('当前的目标商品为', factoryInfo.name, '目标电量', factoryInfo.totalScore, '已充电量', factoryInfo.totalScore, '剩余电量', factoryInfo.remainScore)
            let taskrs = await jdfactory.getTaskDetail(axios, options)
            let willtasks = taskrs.taskVos.filter(t => t.status == 1)
            for (let task of willtasks) {
                console.info(task.taskType, task.taskName)
                if (fs.existsSync(path.join(__dirname, './taskType' + task.taskType + '.js'))) {
                    await require('./taskType' + task.taskType).doTask(axios, {
                        ...options,
                        task,
                        jdfactory
                    })
                } else {
                    console.error('未实现的任务', task.taskType, task.taskName)
                }
            }
        }
    }
}

module.exports = jdfactory