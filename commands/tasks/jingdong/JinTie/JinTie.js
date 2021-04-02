const { w, getFp } = require('../sign/common')
const { parseCookie } = require('../../../../utils/util')

var JinTie = {
    getSignState: async (axios, options) => {
        let cookies = parseCookie(options.cookies, ['3AB9D23F7A4B3C9B'])
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": "https://uua.jr.jd.com",
                "referer": 'https://uua.jr.jd.com/uc-fe-wxgrowing/moneytree/index/'
            },
            url: `https://ms.jr.jd.com/gw/generic/jrm/h5/m/signInforOfJinTie?` + w({
                reqData: JSON.stringify({
                    channel: "sqcs",
                    "riskDeviceParam": JSON.stringify({
                        appId: "jdapp",
                        appType: "3",
                        clientVersion: "9.4.6",
                        deviceType: "VKY-AL00",
                        "eid": cookies['3AB9D23F7A4B3C9B'],
                        "fp": getFp(axios, options),
                        idfa: "",
                        imei: "",
                        ip: "",
                        macAddress: "",
                        networkType: "WIFI",
                        os: "android",
                        osVersion: "9",
                        token: "",
                        uuid: ""
                    })

                })
            }),
            method: 'get'
        })
        if (data.resultCode === 0) {
            if (data.resultData.code === '000') {
                let state = data.resultData.data.sign
                console.info('获取签到状态成功', state ? '今日已签到' : '今日未签到', '连续签到', data.resultData.data.signContinuity, '天')
                return {
                    state
                }
            } else {
                console.error('获取签到状态失败', data.resultData.msg)
            }
        } else {
            console.error('获取签到状态失败', data.resultMsg)
        }
    },
    querySubsidyAccountInfo: async (axios, options) => {
        let cookies = parseCookie(options.cookies, ['3AB9D23F7A4B3C9B'])
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": "https://active.jd.com",
                "referer": 'https://active.jd.com/forever/cashback/index?channellv=sqcs'
            },
            url: `https://ms.jr.jd.com/gw/generic/jrm/h5/m/querySubsidyAccountInfo?` + w({
                reqData: JSON.stringify({
                    channel: "sqcs",
                    "riskDeviceParam": JSON.stringify({
                        appId: "jdapp",
                        appType: "3",
                        clientVersion: "9.4.6",
                        deviceType: "VKY-AL00",
                        "eid": cookies['3AB9D23F7A4B3C9B'],
                        "fp": getFp(axios, options),
                        idfa: "",
                        imei: "",
                        ip: "",
                        macAddress: "",
                        networkType: "WIFI",
                        os: "android",
                        osVersion: "9",
                        token: "",
                        uuid: ""
                    })

                })
            }),
            method: 'get'
        })
        console.info(data.resultData)
    },
    queryAvailableSubsidyAmount: async (axios, options) => {
        let cookies = parseCookie(options.cookies, ['3AB9D23F7A4B3C9B'])
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": "https://active.jd.com",
                "referer": 'https://active.jd.com/forever/cashback/index?channellv=sqcs'
            },
            url: `https://ms.jr.jd.com/gw/generic/jrm/h5/m/queryAvailableSubsidyAmount?` + w({
                reqData: JSON.stringify({
                    channel: "sqcs",
                    "riskDeviceParam": JSON.stringify({
                        appId: "jdapp",
                        appType: "3",
                        clientVersion: "9.4.6",
                        deviceType: "VKY-AL00",
                        "eid": cookies['3AB9D23F7A4B3C9B'],
                        "fp": getFp(axios, options),
                        idfa: "",
                        imei: "",
                        ip: "",
                        macAddress: "",
                        networkType: "WIFI",
                        os: "android",
                        osVersion: "9",
                        token: "",
                        uuid: ""
                    })

                })
            }),
            method: 'get'
        })
        console.info(data.resultData)
    },
    signOne: async (axios, options) => {
        let cookies = parseCookie(options.cookies, ['3AB9D23F7A4B3C9B'])
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": "https://active.jd.com",
                "referer": 'https://active.jd.com/forever/cashback/index?channellv=sqcs'
            },
            url: `https://ms.jr.jd.com/gw/generic/jrm/h5/m/signOfJinTie?` + w({
                reqData: JSON.stringify({
                    "channel": "sqcs",
                    "riskDeviceParam": JSON.stringify({
                        appId: "jdapp",
                        appType: "3",
                        clientVersion: "9.4.6",
                        deviceType: "VKY-AL00",
                        "eid": cookies['3AB9D23F7A4B3C9B'],
                        "fp": getFp(axios, options),
                        idfa: "",
                        imei: "",
                        ip: "",
                        macAddress: "",
                        networkType: "WIFI",
                        os: "android",
                        osVersion: "9",
                        token: "",
                        uuid: ""
                    })

                }),
                method: 'get'
            })
        })
        if (data.resultCode === 0) {
            if (data.resultData.code === '000') {
                console.info('签到成功', data.resultData.data.amount)
                console.reward('金贴', data.resultData.data.amount)
            } else {
                console.error('签到失败', data.resultData.msg)
            }
        } else {
            console.error('签到失败', data.resultMsg)
        }
    },
    doSign: async (axios, options) => {
        let data = await JinTie.getSignState(axios, options)
        if (data) {
            if (!data.state) {
                await JinTie.signOne(axios, options)
            } else {
                console.error('今日已签到')
            }
        }

    },
    queryMission: async (axios, options) => {
        let cookies = parseCookie(options.cookies, ['3AB9D23F7A4B3C9B'])
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": "https://active.jd.com",
                "referer": 'https://active.jd.com/forever/cashback/index?channellv=sqcs'
            },
            url: `https://ms.jr.jd.com/gw/generic/mission/h5/m/queryMission?` + w({
                reqData: JSON.stringify({
                    channel: "sqcs",
                    channelCode: "SUBSIDY2",
                    "riskDeviceParam": JSON.stringify({
                        appId: "jdapp",
                        appType: "3",
                        clientVersion: "9.4.6",
                        deviceType: "VKY-AL00",
                        "eid": cookies['3AB9D23F7A4B3C9B'],
                        "fp": getFp(axios, options),
                        idfa: "",
                        imei: "",
                        ip: "",
                        macAddress: "",
                        networkType: "WIFI",
                        os: "android",
                        osVersion: "9",
                        token: "",
                        uuid: ""
                    })

                }),
                method: 'get'
            })
        })
        if (data.resultCode === 0) {
            if (data.resultData.code === '0000') {
                console.info('获取互动任务成功')
                return data.resultData.data
            } else {
                console.error('获取互动任务失败', data.resultData.msg)
            }
        } else {
            console.error('获取互动任务失败', data.resultMsg)
        }
    },
    receiveMission: async (axios, options) => {
        const { task } = options
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": "https://active.jd.com",
                "referer": 'https://active.jd.com/forever/cashback/index?channellv=sqcs'
            },
            url: `https://ms.jr.jd.com/gw/generic/mission/h5/m/receiveMission?` + w({
                reqData: JSON.stringify({
                    "missionId": task.missionId,
                    "channelCode": "SUBSIDY2",
                    "timeStamp": new Date().toISOString(),
                    "env": "JDAPP"
                }),
                method: 'get'
            })
        })
        if (data.resultCode === 0) {
            if (data.resultData.code === '0000') {
                console.info('任务接取成功')
            } else {
                console.error('任务接取失败', data.resultData.msg)
            }
        } else {
            console.error('任务接取失败', data.resultMsg)
        }
    },
    awardMission: async (axios, options) => {
        const { task } = options
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": "https://active.jd.com",
                "referer": 'https://active.jd.com/forever/cashback/index?channellv=sqcs'
            },
            url: `https://ms.jr.jd.com/gw/generic/mission/h5/m/awardMission?` + w({
                reqData: JSON.stringify({
                    "missionId": task.missionId,
                    "channelCode": "SUBSIDY2",
                    "timeStamp": new Date().toISOString(),
                    "env": "JDAPP"
                }),
                method: 'get'
            })
        })
        if (data.resultCode === 0) {
            if (data.resultData.code === '0000') {
                console.info('任务接取成功')
            } else {
                console.error('任务接取失败', data.resultData.msg)
            }
        } else {
            console.error('任务接取失败', data.resultMsg)
        }
    },
    finishReadMission: async (axios, options) => {
        const { task, readTime } = options
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": "https://active.jd.com",
                "referer": 'https://active.jd.com/forever/cashback/index?channellv=sqcs'
            },
            url: `https://ms.jr.jd.com/gw/generic/mission/h5/m/finishReadMission?` + w({
                reqData: JSON.stringify({ "missionId": task.missionId, "readTime": readTime }),
                method: 'get'
            })
        })
        if (data.resultCode === 0) {
            if (data.resultData.code === '0000') {
                console.info('完成浏览任务成功')
            } else {
                console.error('完成浏览任务失败', data.resultData.msg)
            }
        } else {
            console.error('完成浏览任务失败', data.resultMsg)
        }
    },
    completeTasks: async (axios, options) => {
        let tasks = await JinTie.queryMission(axios, options)
        let willtask = tasks.filter(t => t.status === -1)
        console.info('剩余未接取任务', willtask.length)
        for (let task of willtask) {
            console.info(task.frequencyType, task.name)
            await JinTie.receiveMission(axios, {
                ...options,
                task
            })
            if (task.doLink.indexOf('readTime=') != -1) {
                let readTime = parseInt(task.doLink.substr(task.doLink.indexOf('readTime=') + 9))
                await new Promise((resolve, reject) => setTimeout(resolve, readTime * 1000))
                await JinTie.finishReadMission(axios, {
                    ...options,
                    task,
                    readTime
                })
            } else if (task.detail.indexOf('京东到家') !== -1) {
                // detail=在京东到家完成一次签到
                await require('../daojia/daojia').dosign(axios, {
                    ...options,
                    body: { "channel": "jdjrjintie", "cityId": "", "ifCic": 0 }
                })
            } else if ((task.detail.indexOf('关注') !== -1 || task.detail.indexOf('收藏')) && task.doLink.indexOf('shopId') !== -1) {
                let shopId = task.doLink.substr(task.doLink.indexOf('shopId=') + 7)
                await require('../api/shop').AddShopFav(axios, {
                    ...options,
                    referer: 'https://shop.m.jd.com/',
                    params: {
                        shopId
                    }
                })
                await new Promise((resolve, reject) => setTimeout(resolve, 2 * 1000))
                await require('../api/shop').DelShopFav(axios, {
                    ...options,
                    referer: 'https://shop.m.jd.com/',
                    params: {
                        shopId
                    }
                })
            }
        }

        await new Promise((resolve, reject) => setTimeout(resolve, 3 * 1000))

        tasks = await JinTie.queryMission(axios, options)
        willtask = tasks.filter(t => t.status === 1)
        console.info('剩余未领取奖励任务', willtask.length)
        for (let task of willtask) {
            console.info(task.frequencyType, task.name)
            console.info('预计获得', task.awards[0].awardName, task.awards[0].awardRealNum, task.awards[0].awardUnit)
            await JinTie.awardMission(axios, {
                ...options,
                task
            })
            console.reward(task.awards[0].awardName, task.awards[0].awardRealNum)
        }

        await new Promise((resolve, reject) => setTimeout(resolve, 3 * 1000))

        tasks = await JinTie.queryMission(axios, options)
        willtask = tasks.filter(t => t.status === 0)
        console.info('剩余未完成任务', willtask.length)
        for (let task of willtask) {
            console.info(task.frequencyType, task.name)
        }
    }
}

module.exports = JinTie