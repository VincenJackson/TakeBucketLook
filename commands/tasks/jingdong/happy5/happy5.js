const { transParams, w } = require('../sign/common')
var moment = require('moment');

var happy5 = {
    taskHomePage: async (axios, options) => {
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": `https://happy.m.jd.com`,
                "referer": `https://happy.m.jd.com/babelDiy/zjyw/3ugedFa7yA6NhxLN5gw2L3PF9sQC/index.html`,
            },
            url: `https://api.m.jd.com/client.action?` + w({
                'functionId': 'taskHomePage',
                'appid': 'jd_mp_h5',
                'loginType': '2',
                'client': 'jd_mp_h5',
                'clientVersion': '9.4.6',
                'osVersion': 'AndroidOS',
                'd_brand': 'UnknownPhone',
                'd_model': 'UnknownPhone',
                't': Date.now()
            }),
            method: 'post',
            data: transParams({
                body: JSON.stringify({ "clientInfo": {} })
            })
        })
        return data.data.result.taskInfos
    },
    startTask: async (axios, options) => {
        const { task } = options
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": `https://happy.m.jd.com`,
                "referer": `https://happy.m.jd.com/babelDiy/zjyw/3ugedFa7yA6NhxLN5gw2L3PF9sQC/index.html`,
            },
            url: `https://api.m.jd.com/client.action?` + w({
                'functionId': 'startTask',
                'appid': 'jd_mp_h5',
                'loginType': '2',
                'client': 'jd_mp_h5',
                'clientVersion': '9.4.6',
                'osVersion': 'AndroidOS',
                'd_brand': 'UnknownPhone',
                'd_model': 'UnknownPhone',
                't': Date.now()
            }),
            method: 'post',
            data: transParams({
                body: JSON.stringify({ "clientInfo": {}, "taskType": task.taskType + '' })
            })
        })
        if (data.code === 0) {
            if (data.data.biz_code === 0) {
                console.info(data.data.biz_msg)
            } else {
                console.error(data.data.biz_msg)
            }
        } else {
            console.error('领取任务失败', data)
        }
    },
    getTaskDetailForColor: async (axios, options) => {
        const { task } = options
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": `https://happy.m.jd.com`,
                "referer": `https://happy.m.jd.com/babelDiy/zjyw/3ugedFa7yA6NhxLN5gw2L3PF9sQC/index.html`,
            },
            url: `https://api.m.jd.com/client.action?` + w({
                'functionId': 'getTaskDetailForColor',
                'appid': 'jd_mp_h5',
                'loginType': '2',
                'client': 'jd_mp_h5',
                'clientVersion': '9.4.6',
                'osVersion': 'AndroidOS',
                'd_brand': 'UnknownPhone',
                'd_model': 'UnknownPhone',
                't': Date.now()
            }),
            method: 'post',
            data: transParams({
                body: JSON.stringify({ "clientInfo": {}, "taskType": task.taskType + '' })
            })
        })
        return data.data.result.advertDetails
    },
    taskReportForColor: async (axios, options) => {
        const { task, avt } = options
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": `https://happy.m.jd.com`,
                "referer": `https://happy.m.jd.com/babelDiy/zjyw/3ugedFa7yA6NhxLN5gw2L3PF9sQC/index.html`,
            },
            url: `https://api.m.jd.com/client.action?` + w({
                'functionId': 'taskReportForColor',
                'appid': 'jd_mp_h5',
                'loginType': '2',
                'client': 'jd_mp_h5',
                'clientVersion': '9.4.6',
                'osVersion': 'AndroidOS',
                'd_brand': 'UnknownPhone',
                'd_model': 'UnknownPhone',
                't': Date.now()
            }),
            method: 'post',
            data: transParams({
                body: JSON.stringify({ "clientInfo": {}, "taskType": task.taskType + '', "detailId": avt.id + '' })
            })
        })
        if (data.code === 0) {
            if (data.data.biz_code === 0) {
                console.info('提交子任务完成')
            } else {
                console.error(data.data.biz_msg)
            }
        } else {
            console.error('提交子任务失败', data)
        }
    },
    receiveTaskRedpacket: async (axios, options) => {
        const { task } = options
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": `https://happy.m.jd.com`,
                "referer": `https://happy.m.jd.com/babelDiy/zjyw/3ugedFa7yA6NhxLN5gw2L3PF9sQC/index.html`,
            },
            url: `https://api.m.jd.com/client.action?` + w({
                'functionId': 'receiveTaskRedpacket',
                'appid': 'jd_mp_h5',
                'loginType': '2',
                'client': 'jd_mp_h5',
                'clientVersion': '9.4.6',
                'osVersion': 'AndroidOS',
                'd_brand': 'UnknownPhone',
                'd_model': 'UnknownPhone',
                't': Date.now()
            }),
            method: 'post',
            data: transParams({
                body: JSON.stringify({ "clientInfo": {}, "taskType": task.taskType + '' })
            })
        })
        if (data.code === 0) {
            if (data.data.biz_code === 0) {
                console.reward('红包', data.data.result.discount)
            } else {
                console.error(data.data.biz_msg)
            }
        } else {
            console.error('领取红包失败', data)
        }
    },
    doTask: async (axios, options) => {
        if (moment().isoWeekday() !== 5) {
            console.error('不在活动有效时间')
            return
        }
        let tasks = await happy5.taskHomePage(axios, options)
        let willtasks = tasks.filter(t => t.innerStatus == 7)
        console.info('剩余未开始任务', willtasks.length)
        for (let task of willtasks) {
            await happy5.startTask(axios, {
                ...options,
                task
            })
            await new Promise((resolve, reject) => setTimeout(resolve, 1 * 1000))
        }

        tasks = await happy5.taskHomePage(axios, options)
        willtasks = tasks.filter(t => t.innerStatus == 2)
        console.info('剩余未完成任务', willtasks.length)
        for (let task of willtasks) {
            console.info(task.taskType, task.title)
            if ([0, 2].indexOf(task.taskType) !== -1) {
                continue
            }
            let avts = await happy5.getTaskDetailForColor(axios, {
                ...options,
                task
            })
            let willavts = avts.filter(a => a.status === 0)
            console.info('未完成的子任务数', willavts.length)
            for (let avt of willavts) {
                await new Promise((resolve, reject) => setTimeout(resolve, 3 * 1000))
                await happy5.taskReportForColor(axios, {
                    ...options,
                    task,
                    avt
                })
            }
            await new Promise((resolve, reject) => setTimeout(resolve, 1 * 1000))
        }

        tasks = await happy5.taskHomePage(axios, options)
        willtasks = tasks.filter(t => t.innerStatus == 3)
        console.info('剩余未开红包任务', willtasks.length)
        for (let task of willtasks) {
            await happy5.receiveTaskRedpacket(axios, {
                ...options,
                task
            })
            await new Promise((resolve, reject) => setTimeout(resolve, 1 * 1000))
        }
    }

}
module.exports = happy5