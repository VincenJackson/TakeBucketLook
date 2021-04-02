const { w } = require("../sign/common")

var farm = {
    initForFarm: async (axios, options) => {
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": `https://carry.m.jd.com`,
                "referer": `https://carry.m.jd.com/babelDiy/Zeus/3KSjXqQabiTuD1cJ28QskrpWoBKT/index.html`,
            },
            url: `https://api.m.jd.com/client.action?` + w({
                functionId: 'initForFarm',
                body: JSON.stringify({
                    "imageUrl": "",
                    "nickName": "",
                    "shareCode": "",
                    "babelChannel": "121",
                    "lng": "",
                    "lat": "",
                    "sid": "",
                    "un_area": "",
                    "version": 10,
                    "channel": 1
                }),
                appid: 'wh5'
            }),
            method: 'get'
        })
        if (data.code === '0') {
            console.info('登录农场成功', '已有能量', data.farmUserPro.totalEnergy, '助力码', data.farmUserPro.shareCode)
            if (!data.todayGotNewUser) {
                await require('./farm').gotNewUserTaskForFarm(axios, options)
            }
        } else {
            console.error('登录农场失败')
        }
    },
    waterGoodForFarm: async (axios, options) => {
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": `https://carry.m.jd.com`,
                "referer": `https://carry.m.jd.com/babelDiy/Zeus/3KSjXqQabiTuD1cJ28QskrpWoBKT/index.html`,
            },
            url: `https://api.m.jd.com/client.action?` + w({
                functionId: 'waterGoodForFarm',
                body: JSON.stringify({ "type": "", "version": 10, "channel": 1 }),
                appid: 'wh5'
            }),
            method: 'get'
        })
        if (data.code === '0') {
            console.info('浇水成功', '剩余营养液', data.totalEnergy, '已浇水次数', data.totalWaterTimes)
            return {
                Energy: data.totalEnergy,
                Times: data.totalWaterTimes
            }
        } else {
            console.error('浇水失败', data)
            return {
                Energy: 0,
                Times: 0
            }
        }
    },
    waterRainForFarm: async (axios, options) => {
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": `https://carry.m.jd.com`,
                "referer": `https://carry.m.jd.com/babelDiy/Zeus/3KSjXqQabiTuD1cJ28QskrpWoBKT/index.html`,
            },
            url: `https://api.m.jd.com/client.action?` + w({
                functionId: 'waterRainForFarm',
                body: JSON.stringify({ "type": 1, "hongBaoTimes": 30 + Math.random() * 10, "version": 3 }),
                appid: 'wh5'
            }),
            method: 'get'
        })
        if (data.code === '0') {
            console.info('采集成功', '获得营养液', data.addEnergy)
        } else {
            console.error('采集失败', data)
        }
    },
    doWater: async (axios, options) => {
        let { limit } = options
        limit = limit || 20
        let n = limit
        while (n > 0) {
            let { Energy, Times } = await farm.waterGoodForFarm(axios, options)
            if (Energy < 10) {
                console.error('营养液不足,不能浇水')
                break
            }
            if (Times > limit) {
                console.error(`已达到浇水次数${limit},不再浇水`)
                break
            }
            n--
        }
    },
    farmsharcode: async (axios, options) => {
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": `https://carry.m.jd.com`,
                "referer": `https://carry.m.jd.com/babelDiy/Zeus/3KSjXqQabiTuD1cJ28QskrpWoBKT/index.html`,
            },
            url: `https://api.m.jd.com/client.action?` + w({
                functionId: 'initForFarm',
                body: JSON.stringify({
                    "imageUrl": "",
                    "nickName": "",
                    "shareCode": "",
                    "babelChannel": "121",
                    "lng": "",
                    "lat": "",
                    "sid": "",
                    "un_area": "",
                    "version": 10,
                    "channel": 1
                }),
                appid: 'wh5'
            }),
            method: 'get'
        })
        // "1=小程序, 2=h5 ,3 = 京口令"
        if (data.code === '0') {
            console.log('我的东东农场助力码', data.farmUserPro.shareCode + `-3`)
        } else {
            console.error('获取助力码失败', data)
        }
    },
    gotNewUserTaskForFarm: async (axios, options) => {
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": `https://carry.m.jd.com`,
                "referer": `https://carry.m.jd.com/babelDiy/Zeus/3KSjXqQabiTuD1cJ28QskrpWoBKT/index.html`,
            },
            url: `https://api.m.jd.com/client.action?` + w({
                functionId: 'gotNewUserTaskForFarm',
                body: JSON.stringify({ "version": 10, "channel": 1 }),
                appid: 'wh5'
            }),
            method: 'get'
        })
        if (data.code === '0') {
            console.info('获得新人礼包能量', data.addEnergy)
        } else {
            console.error('今日已领取过新人礼包能量')
        }
    },
    firstWaterTaskForFarm: async (axios, options) => {
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": `https://carry.m.jd.com`,
                "referer": `https://carry.m.jd.com/babelDiy/Zeus/3KSjXqQabiTuD1cJ28QskrpWoBKT/index.html`,
            },
            url: `https://api.m.jd.com/client.action?` + w({
                functionId: 'firstWaterTaskForFarm',
                body: JSON.stringify({ "version": 10, "channel": 1 }),
                appid: 'wh5'
            }),
            method: 'get'
        })
        console.log(data)
    },
    gotThreeMealForFarm: async (axios, options) => {
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": `https://carry.m.jd.com`,
                "referer": `https://carry.m.jd.com/babelDiy/Zeus/3KSjXqQabiTuD1cJ28QskrpWoBKT/index.html`,
            },
            url: `https://api.m.jd.com/client.action?` + w({
                functionId: 'gotThreeMealForFarm',
                body: JSON.stringify({ "type": 0, "version": 10, "channel": 1 }),
                appid: 'wh5'
            }),
            method: 'get'
        })
        console.log(data)
    },
    taskInitForFarm: async (axios, options) => {
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": `https://carry.m.jd.com`,
                "referer": `https://carry.m.jd.com/babelDiy/Zeus/3KSjXqQabiTuD1cJ28QskrpWoBKT/index.html`,
            },
            url: `https://api.m.jd.com/client.action?` + w({
                functionId: 'taskInitForFarm',
                body: JSON.stringify({ "version": 10, "channel": 1 }),
                appid: 'wh5'
            }),
            method: 'get'
        })
        return data
    },
    browseAdTaskForFarm: async (axios, options) => {
        const { body } = options
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": `https://carry.m.jd.com`,
                "referer": `https://carry.m.jd.com/babelDiy/Zeus/3KSjXqQabiTuD1cJ28QskrpWoBKT/index.html`,
            },
            url: `https://api.m.jd.com/client.action?` + w({
                functionId: 'browseAdTaskForFarm',
                body: JSON.stringify(body),
                appid: 'wh5'
            }),
            method: 'get'
        })
        if (data.code === '0') {
            console.info('任务操作成功')
        } else {
            console.error('任务操作失败', data)
        }
    },
    clockInForFarm: async (axios, options) => {
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": `https://carry.m.jd.com`,
                "referer": `https://carry.m.jd.com/babelDiy/Zeus/3KSjXqQabiTuD1cJ28QskrpWoBKT/index.html`,
            },
            url: `https://api.m.jd.com/client.action?` + w({
                functionId: 'clockInForFarm',
                body: JSON.stringify({ "type": 1, "version": 10, "channel": 1 }),
                appid: 'wh5'
            }),
            method: 'get'
        })
        if (data.code === '0') {
            console.info('签到成功', '水滴', data.amount)
        } else {
            console.error('签到失败', data)
        }
    },
    firstWaterTask: async (axios, options) => {
        let { firstWaterInit } = await farm.taskInitForFarm(axios, options)
        if (!firstWaterInit.firstWaterFinished) {
            await farm.waterGoodForFarm(axios, options)
            await farm.firstWaterTaskForFarm(axios, options)
        }
    },
    completeTask: async (axios, options) => {
        let { firstWaterInit, totalWaterTaskInit, gotBrowseTaskAdInit } = await farm.taskInitForFarm(axios, options)
        if (!gotBrowseTaskAdInit.f) {
            for (let task of gotBrowseTaskAdInit.userBrowseTaskAds) {
                console.info(task.mainTitle, task.subTitle)
                if (task.hadFinishedTimes < task.limit) {
                    await new Promise((resolve, reject) => setTimeout(resolve, 6 * 1000))
                    await farm.browseAdTaskForFarm(axios, {
                        ...options,
                        task,
                        body: { "advertId": task.advertId, "type": 0, "version": 10, "channel": 1 }
                    })
                    await new Promise((resolve, reject) => setTimeout(resolve, 1 * 1000))
                    await farm.browseAdTaskForFarm(axios, {
                        ...options,
                        task,
                        body: { "advertId": task.advertId, "type": 1, "version": 10, "channel": 1 }
                    })
                }
            }
        }
        if (!totalWaterTaskInit.f) {
            await farm.doWater(axios, {
                ...options,
                limit: totalWaterTaskInit.totalWaterTaskLimit
            })
        }
        if (!firstWaterInit.f) {
            await farm.waterRainForFarm(axios, options)
        }
    },
    initForTurntableFarm: async (axios, options) => {
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": `https://carry.m.jd.com`,
                "referer": `https://carry.m.jd.com/babelDiy/Zeus/3KSjXqQabiTuD1cJ28QskrpWoBKT/index.html`,
            },
            url: `https://api.m.jd.com/client.action?` + w({
                functionId: 'initForTurntableFarm',
                body: JSON.stringify({ "version": 4, "channel": 1 }),
                appid: 'wh5'
            }),
            method: 'get'
        })
        if (data.code === '0') {
            console.info('已获得抽奖机会', data.remainLotteryTimes)
            return data.remainLotteryTimes
        } else {
            console.error('抽奖失败', data)
        }
    },
    lotteryForTurntableFarm: async (axios, options) => {
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": `https://carry.m.jd.com`,
                "referer": `https://carry.m.jd.com/babelDiy/Zeus/3KSjXqQabiTuD1cJ28QskrpWoBKT/index.html`,
            },
            url: `https://api.m.jd.com/client.action?` + w({
                functionId: 'lotteryForTurntableFarm',
                body: JSON.stringify({ "type": 1, "version": 4, "channel": 1 }),
                appid: 'wh5'
            }),
            method: 'get'
        })
        if (data.code === '0') {
            console.info('抽奖成功', data.type, data.beanCount)
            if (data.type.indexOf('bean') !== -1) {
                console.reward('京豆', data.beanCount)
            }
        } else {
            console.error('抽奖失败', data)
        }
    },
}

module.exports = farm