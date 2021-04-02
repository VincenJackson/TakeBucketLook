const { transParams, w } = require('../sign/common')
const path = require('path')
const fs = require('fs-extra')

var seckill = {
    homePageV2: async (axios, options) => {
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": `https://h5.m.jd.com`,
                "referer": `https://h5.m.jd.com/babelDiy/Zeus/2NUvze9e1uWf4amBhe1AV6ynmSuH/index.html`,
            },
            url: `https://api.m.jd.com/client.action?` + w({
                functionId: 'homePageV2',
                appid: "SecKill2020",
                body: JSON.stringify({}),
                clientVersion: '9.4.6',
                client: 'wh5',
            }),
            method: 'post'
        })
        console.info('已有秒秒币', data.result?.assignment?.assignmentPoints || 0)
        return data.result
    },
    queryInteractiveInfo: async (axios, options) => {
        const { projectId } = options
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": `https://h5.m.jd.com`,
                "referer": `https://h5.m.jd.com/babelDiy/Zeus/2NUvze9e1uWf4amBhe1AV6ynmSuH/index.html`,
            },
            url: `https://api.m.jd.com/client.action?` + w({
                functionId: 'queryInteractiveInfo',
                body: JSON.stringify({ "encryptProjectId": projectId, "sourceCode": "wh5" }),
                clientVersion: '1.0.0',
                client: 'wh5',
            }),
            method: 'post'
        })
        return data
    },
    doInteractiveAssignment: async (axios, options) => {
        const { projectId, task, item, actionType, completionFlag } = options
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": `https://h5.m.jd.com`,
                "referer": `https://h5.m.jd.com/babelDiy/Zeus/2NUvze9e1uWf4amBhe1AV6ynmSuH/index.html`,
            },
            url: `https://api.m.jd.com/client.action?` + w({
                functionId: 'doInteractiveAssignment',
                body: JSON.stringify({
                    "encryptProjectId": projectId,
                    "encryptAssignmentId": task.encryptAssignmentId,
                    "itemId": item.id,
                    "actionType": actionType,
                    "sourceCode": "wh5",
                    "completionFlag": completionFlag || "",
                    "ext": {}
                }),
                clientVersion: '1.0.0',
                client: 'wh5',
            }),
            method: 'post'
        })
        if (data.code === '0') {
            if (data.subCode === '0') {
                console.info('操作成功')
                let rewards = data?.rewardsInfo?.successRewards
                if (rewards) {
                    for (let k in rewards) {
                        console.info('获得秒秒币', rewards[k].quantity || 0)
                    }
                }
            } else {
                console.error('subCode', data.subCode, data.msg)
            }
        } else {
            console.error('操作失败', data)
        }
    },
    qryViewkitCallbackResult: async (axios, options) => {
        const { projectId, task, item } = options
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": `https://h5.m.jd.com`,
                "referer": `https://h5.m.jd.com/babelDiy/Zeus/2NUvze9e1uWf4amBhe1AV6ynmSuH/index.html`,
            },
            url: `https://api.m.jd.com/client.action?` + w({
                functionId: 'qryViewkitCallbackResult',
                body: JSON.stringify({
                    clientLanguage: "zh",
                    dataSource: "babelInteractive",
                    method: "customDoInteractiveAssignmentForBabel",
                    reqParams: JSON.stringify({
                        "itemId": item.id,
                        "encryptProjectId": projectId,
                        "encryptAssignmentId": task.encryptAssignmentId
                    }),
                    taskSDKVersion: "1.0.4",
                    vkVersion: "1.0.0"
                }),
                clientVersion: '1.0.0',
                client: 'wh5',
            }),
            method: 'post'
        })
        console.log(data)
    },
    assignmentPointsTransferRedPackage: async (axios, options) => {
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": `https://h5.m.jd.com`,
                "referer": `https://h5.m.jd.com/babelDiy/Zeus/2NUvze9e1uWf4amBhe1AV6ynmSuH/index.html`,
            },
            url: `https://api.m.jd.com/client.action?` + w({
                functionId: 'assignmentPointsTransferRedPackage',
                appid: "jwsp",
                body: JSON.stringify({ "assignmentPointsNum": "100" }),
                clientVersion: '1.0.0',
                client: 'wh5',
            }),
            method: 'post'
        })
        if (data.code === 200) {
            let rewards = data?.result?.assignmentResult?.rewardsInfo?.successRewards
            if (rewards) {
                for (let k in rewards) {
                    rewards[k].map(r => {
                        console.info('获得红包', r.discount)
                    })
                }
            }
        } else {
            console.error('兑换失败', data.result.title)
        }
    },
    doTask: async (axios, options) => {
        let { projectId } = await seckill.homePageV2(axios, options)
        let { assignmentList } = await seckill.queryInteractiveInfo(axios, {
            ...options,
            projectId
        })

        let willtasks = assignmentList.filter(t => !t.completionFlag)
        for (let task of willtasks) {
            console.info(task.assignmentType, task.assignmentName)
            if (fs.existsSync(path.join(__dirname, './taskType' + task.assignmentType + '.js'))) {
                await require('./taskType' + task.assignmentType).doTask(axios, {
                    ...options,
                    task,
                    projectId,
                    seckill
                })
            } else {
                console.error('未实现的任务', task.assignmentType, task.assignmentName)
            }
        }

        console.info('查询任务结果')
        let { assignment } = await seckill.homePageV2(axios, options)
        let n = assignment?.assignmentPoints || 0
        if (n >= 100) {
            console.info('秒秒币已达100以上，开始兑换红包')
        }
        while (n >= 100) {
            await seckill.assignmentPointsTransferRedPackage(axios, options)
            await new Promise((resolve, reject) => setTimeout(resolve, 1000))
            n -= 100
        }
    }
}
module.exports = seckill