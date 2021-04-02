const { getFp, transParams, w } = require('../sign/common')
const { parseCookie } = require('../../../../utils/util')
const { CompleteEvent } = require('../../../../utils/EnumError')
const path = require('path')
const fs = require('fs-extra')

// sosurce 0 , 2  // 0普通， 2金融app
var moneytree = {
    getSignState: async (axios, options) => {
        let cookies = parseCookie(options.cookies, ['3AB9D23F7A4B3C9B'])
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": "https://uua.jr.jd.com",
                "referer": 'https://uua.jr.jd.com/uc-fe-wxgrowing/moneytree/index/'
            },
            url: `https://ms.jr.jd.com/gw/generic/uc/h5/m/signIndex?_=` + Date.now(),
            method: 'post',
            data: transParams({
                reqData: JSON.stringify({
                    "source": 2,
                    "riskDeviceParam": JSON.stringify({
                        "eid": cookies['3AB9D23F7A4B3C9B'],
                        "fp": getFp(axios, options),
                        // "sdkToken": "",
                        // "token": "",
                        // "jstub": "",
                        "appType": 4
                    })

                })
            })
        })

        if (data.resultCode === 0) {
            if (data.resultData.code === '200') {
                let state = data.resultData.data.canSign === 2
                console.info('获取签到状态成功', state ? '能签到' : '不能签到')
                return {
                    signDay: data.resultData.data.signDay,
                    state
                }
            } else {
                console.error('获取签到状态失败', data.resultData.msg)
            }
        } else {
            console.error('获取签到状态失败', data.resultMsg)
        }

    },
    signOne: async (axios, options) => {
        const { signDay } = options
        let cookies = parseCookie(options.cookies, ['3AB9D23F7A4B3C9B'])
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": "https://uua.jr.jd.com",
                "referer": 'https://uua.jr.jd.com/uc-fe-wxgrowing/moneytree/index/'
            },
            url: `https://ms.jr.jd.com/gw/generic/uc/h5/m/signOne?_=` + Date.now(),
            method: 'post',
            data: transParams({
                reqData: JSON.stringify({
                    "source": 2,
                    "signDay": signDay,
                    "riskDeviceParam": JSON.stringify({
                        "eid": cookies['3AB9D23F7A4B3C9B'],
                        "fp": getFp(axios, options),
                        // "sdkToken": "",
                        // "token": "",
                        // "jstub": "",
                        "appType": 4
                    })

                })
            })
        })
        if (data.resultCode === 0) {
            console.info(data.resultData)
            if (data.resultData.code === '200') {
                console.info('签到成功', data.resultData.data.result)
            } else {
                console.error('签到失败', data.resultData.msg)
            }
        } else {
            console.error('签到失败', data.resultMsg)
        }
    },
    doSign: async (axios, options) => {
        let data = await moneytree.getSignState(axios, options)
        if (data) {
            if (data.state) {
                await moneytree.signOne(axios, {
                    ...options,
                    signDay: data.signDay
                })
            } else {
                console.error('今日已签到')
            }
        }

    },
    doWork: async (axios, options) => {
        const { task, opType } = options
        let cookies = parseCookie(options.cookies, ['3AB9D23F7A4B3C9B'])
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": "https://uua.jr.jd.com",
                "referer": 'https://uua.jr.jd.com/uc-fe-wxgrowing/moneytree/index/'
            },
            url: `https://ms.jr.jd.com/gw/generic/uc/h5/m/doWork?_=` + Date.now(),
            method: 'post',
            data: transParams({
                reqData: JSON.stringify({
                    "source": 2,
                    "workType": task.workType,
                    "opType": opType,
                    "mid": task.mid + '',
                    "riskDeviceParam": JSON.stringify({
                        "eid": cookies['3AB9D23F7A4B3C9B'],
                        "fp": getFp(axios, options),
                        // "sdkToken": "",
                        // "token": "",
                        // "jstub": "",
                        "appType": 4
                    })

                })
            })
        })
        if (data.resultCode === 0) {
            if (data.resultData.code === '200') {
                if (data.resultData.data.prizeAmount) {
                    console.info('操作结果', '获得金果', data.resultData.data.prizeAmount)
                } else {
                    console.info('操作结果', data.resultData.data.opMsg)
                }
            } else {
                console.error('操作失败', data.resultData.msg)
            }
        } else {
            console.error('操作失败', data.resultMsg)
        }
    },

    getdaliywork: async (axios, options) => {
        let cookies = parseCookie(options.cookies, ['3AB9D23F7A4B3C9B'])
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": "https://uua.jr.jd.com",
                "referer": 'https://uua.jr.jd.com/uc-fe-wxgrowing/moneytree/index/'
            },
            url: `https://ms.jr.jd.com/gw/generic/uc/h5/m/dayWork?_=` + Date.now(),
            method: 'post',
            data: transParams({
                reqData: JSON.stringify({
                    "source": 2,
                    "linkMissionIds": ["666", "667"],
                    "LinkMissionIdValues": [6, 6],
                    "riskDeviceParam": JSON.stringify({
                        "eid": cookies['3AB9D23F7A4B3C9B'],
                        "fp": getFp(axios, options),
                        // "sdkToken": "",
                        // "token": "",
                        // "jstub": "",
                        "appType": 4
                    })

                })
            })
        })

        if (data.resultCode === 0) {
            if (data.resultData.code === '200') {
                console.info('获取任务成功')
                return data.resultData.data
            } else {
                console.error('获取任务失败', data.resultData.msg)
            }
        } else {
            console.error('获取任务失败', data.resultMsg)
        }
    },
    finishReadMission: async (axios, options) => {
        const { task } = options
        let cookies = parseCookie(options.cookies, ['3AB9D23F7A4B3C9B'])
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": "https://uua.jr.jd.com",
                "referer": 'https://uua.jr.jd.com/uc-fe-wxgrowing/moneytree/index/'
            },
            url: `https://ms.jr.jd.com/gw/generic/mission/h5/m/finishReadMission?` + w({
                reqData: JSON.stringify({ "missionId": task.mid + '', "readTime": 15 })
            }),
            method: 'get'
        })
        if (data.resultCode === 0) {
            if (data.resultData.code === '0000') {
                console.info('完成任务成功')
            } else {
                console.error('获取任务失败', data.resultData.msg)
            }
        } else {
            console.error('获取任务失败', data.resultMsg)
        }
    },
    completedaliywork: async (axios, options) => {
        let tasks = await moneytree.getdaliywork(axios, options)
        let willtasks = (tasks || []).filter(t => t.workStatus === -1)
        console.info('剩余未开始任务', willtasks.length)
        for (let task of willtasks) {
            console.info(task.workType, task.workName || '逛活动得金果')
            if (task.workType == 6) {
                await moneytree.doWork(axios, {
                    ...options,
                    task,
                    opType: 4
                })
                console.log('需要去完成相关的实际任务操作才有效')
                await new Promise((resolve, reject) => setTimeout(resolve, 15 * 1000))

            } else {
                console.error('未实现的任务', task.workName, task.workType)
            }
        }
        await new Promise((resolve, reject) => setTimeout(resolve, 3 * 1000))
        let willtasks1 = (tasks || []).filter(t => t.workStatus === 0)
        console.info('剩余待完成任务', willtasks1.length)
        for (let task of willtasks1) {
            console.info(task.workType, task.workName || '逛活动得金果')
            if ([2480, 3212, 3104, 3209].indexOf(task.mid) !== -1) {
                await moneytree.finishReadMission(axios, {
                    ...options,
                    task
                })
                await new Promise((resolve, reject) => setTimeout(resolve, 1000))
                await moneytree.doWork(axios, {
                    ...options,
                    task,
                    opType: 2
                })
            } else if (fs.existsSync(path.join(__dirname, './workType' + task.workType + '.js'))) {
                await require('./workType' + task.workType).doTask(axios, {
                    ...options,
                    task,
                    moneytree
                })
                await new Promise((resolve, reject) => setTimeout(resolve, 1000))
                await moneytree.doWork(axios, {
                    ...options,
                    task,
                    opType: 2
                })
            } else {
                console.error('未实现的任务', task.workName, task.workType)
            }
        }
        await new Promise((resolve, reject) => setTimeout(resolve, 3 * 1000))
        let willtasks2 = (tasks || []).filter(t => t.workStatus === 1)
        console.info('剩余未领取任务', willtasks2.length)
        for (let task of willtasks2) {
            console.info(task.workType, task.workName || '逛活动得金果')
            await moneytree.doWork(axios, {
                ...options,
                task,
                opType: 2
            })
            await new Promise((resolve, reject) => setTimeout(resolve, 5 * 1000))
        }
    },
    login: async (axios, options) => {
        let cookies = parseCookie(options.cookies, ['3AB9D23F7A4B3C9B'])
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": "https://uua.jr.jd.com",
                "referer": 'https://uua.jr.jd.com/uc-fe-wxgrowing/moneytree/index/'
            },
            url: `https://ms.jr.jd.com/gw/generic/uc/h5/m/login?_=` + Date.now(),
            method: 'post',
            data: transParams({
                reqData: JSON.stringify({
                    channelLV: "",
                    sharePin: "",
                    shareType: 1,
                    source: 2, //source || 0, // 0普通， 2金融app
                    "riskDeviceParam": JSON.stringify({
                        "eid": cookies['3AB9D23F7A4B3C9B'],
                        "fp": getFp(axios, options),
                        // "sdkToken": "",
                        // "token": "",
                        // "jstub": "",
                        "appType": 4
                    })

                })
            })
        })
        if (data.resultData?.code === '200') {
            return data.resultData.data
        } else {
            console.error(data)
            if (data.resultData.msg.indexOf('风控') !== -1) {
                throw new CompleteEvent('出现风控，直接更改任务状态为完成')
            }
        }
    },
    harvest: async (axios, options) => {
        const { user } = options
        let cookies = parseCookie(options.cookies, ['3AB9D23F7A4B3C9B'])
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": "https://uua.jr.jd.com",
                "referer": 'https://uua.jr.jd.com/uc-fe-wxgrowing/moneytree/index/?sid=608298c183fdd08ff70290649a96be4w',
                "X-Requested-With": 'com.jd.jrapp'
            },
            url: `https://ms.jr.jd.com/gw/generic/uc/h5/m/harvest?_=` + Date.now(),
            method: 'post',
            data: transParams({
                reqData: JSON.stringify({
                    channel: "",
                    sharePin: "",
                    shareType: 1,
                    source: user.treeInfo.level < 5 ? 0 : 2,
                    userId: user.userInfo,
                    userToken: user.userToken,
                    "riskDeviceParam": JSON.stringify({
                        "eid": cookies['3AB9D23F7A4B3C9B'],
                        "fp": getFp(axios, options),
                        // "sdkToken": "",
                        // "token": "",
                        // "jstub": "",
                        "appType": 4
                    })

                })
            })
        })
        if (data.resultCode === 0) {
            if (data.resultData.code === '200') {
                console.log('收金果成功')
                return data.resultData.data
            } else {
                console.error('收金果失败', data.resultData.msg)
            }
        } else {
            console.error('收金果失败', data.resultMsg)
        }
    },
    fruitAward: async (axios, options) => {
        const { randomAward } = options
        let cookies = parseCookie(options.cookies, ['3AB9D23F7A4B3C9B'])
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": "https://uua.jr.jd.com",
                "referer": 'https://uua.jr.jd.com/uc-fe-wxgrowing/moneytree/index/'
            },
            url: `https://ms.jr.jd.com/gw/generic/uc/h5/m/fruitAward?_=` + Date.now(),
            method: 'post',
            data: transParams({
                reqData: JSON.stringify({
                    source: 0,
                    times: randomAward.times,
                    type: randomAward.awardType,
                    "riskDeviceParam": JSON.stringify({
                        "eid": cookies['3AB9D23F7A4B3C9B'],
                        "fp": getFp(axios, options),
                        // "sdkToken": "",
                        // "token": "",
                        // "jstub": "",
                        "appType": 4
                    })

                })
            })
        })
        console.log(data.resultData)
        if (data.resultCode === 0) {
            if (data.resultData.code === '200') {
                console.info('翻倍金果成功')
            } else {
                console.error('翻倍金果失败', data.resultData.msg)
            }
        } else {
            console.error('翻倍金果失败', data.resultMsg)
        }
    },
    timeharvest: async (axios, options) => {
        let maxtime = 1 * 3600
        console.info('开始收金果,预计持续1个小时')
        do {
            // 登录key有效期10分钟，超过会导致操作无权限
            let time = 600 - 20
            let user = await moneytree.login(axios, options)
            if (!user) {
                break
            }
            do {
                let data = await moneytree.harvest(axios, {
                    ...options,
                    user
                })
                if (data) {
                    if (data.randomAward) {
                        await moneytree.fruitAward(axios, {
                            ...options,
                            randomAward: data.randomAward,
                            user
                        })
                    }
                    console.log(data.treeInfo.treeName, data.treeInfo.fruit, data.treeInfo.level, data.treeInfo.progressLeft)
                    await new Promise((resolve, reject) => setTimeout(resolve, 20 * 1000))
                    time -= 20
                    if (time <= 0) {
                        break
                    }
                } else {
                    break
                }
            } while (true)

            await new Promise((resolve, reject) => setTimeout(resolve, 20 * 1000))
            maxtime -= 600

            if (maxtime <= 0) {
                console.info('已运行1个小时了，休息一会吧')
                break
            }
        } while (true)
    }
}
module.exports = moneytree