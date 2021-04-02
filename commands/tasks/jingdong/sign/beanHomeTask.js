const { w } = require("./common")

var task = {
    totask: async (axios, options) => {
        const { body } = options
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": `https://spa.jd.com/home`,
                "referer": `https://spa.jd.com/home/`,
            },
            url: `https://api.m.jd.com/client.action?` + w({
                functionId: 'beanHomeTask',
                body: JSON.stringify(body),
                appid: 'ld',
                client: 'android',
                clientVersion: '9.4.4',
                networkType: 'wifi',
                osVersion: 9,
            }),
            method: 'post'
        })
        if (data.errorCode) {
            console.error(data.errorMessage)
        }
        return data.data
    },
    findBeanHome: async (axios, options) => {
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": `https://spa.jd.com/home`,
                "referer": `https://spa.jd.com/home/`,
            },
            url: `https://api.m.jd.com/client.action?` + w({
                functionId: 'findBeanHome',
                body: JSON.stringify({ "source": "huiyuan", "orderId": null, "rnVersion": "3.9", "rnClient": "1" }),
                appid: 'ld',
                client: 'android',
                clientVersion: '9.4.4',
                networkType: 'wifi',
                osVersion: 9,
            }),
            method: 'post'
        })
        return {
            stageList: data.data.floorList.find(f => f.floorId === '04759323').stageList,
            awardStatus: data.data.awardStatus
        }
    },
    homeFeedsList: async (axios, options) => {
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": `https://spa.jd.com/home`,
                "referer": `https://spa.jd.com/home/`,
            },
            url: `https://api.m.jd.com/client.action?` + w({
                functionId: 'homeFeedsList',
                body: JSON.stringify({ "page": 1 }),
                appid: 'ld',
                client: 'android',
                clientVersion: '9.4.4',
                networkType: 'wifi',
                osVersion: 9,
            }),
            method: 'post'
        })
        return {
            goods: data.data.feedsList,
            awardStatus: data.data.awardStatus
        }
    },
    doTask: async (axios, options) => {
        let { goods, awardStatus } = await task.homeFeedsList(axios, options)
        if (!awardStatus) {
            let n = 3
            for (let good of goods) {
                let res = await task.totask(axios, {
                    ...options,
                    body: {
                        "skuId": good.skuId,
                        "awardFlag": false,
                        "type": "1",
                        "source": "feeds",
                        "scanTime": Date.now()
                    }
                })
                if (!res || res.taskProgress === res.taskThreshold) {
                    break
                }
                await new Promise((resolve, reject) => setTimeout(resolve, 3 * 1000))
                n--
                if (n <= 0) {
                    break
                }
            }
            console.info('完成浏览3个商品送京豆任务, 领取京豆中')
            let d = await task.totask(axios, {
                ...options,
                body: { "awardFlag": true, "source": "feeds" }
            })
            if (d && d.beanNum) {
                console.reward('京豆', d.beanNum)
            }
        }

        await new Promise((resolve, reject) => setTimeout(resolve, 3 * 1000))

        // 种豆得豆
        await task.totask(axios, {
            ...options,
            body: { "type": "3", "source": "home", "awardFlag": false, "itemId": "zddd" }
        })
        await new Promise((resolve, reject) => setTimeout(resolve, 5 * 1000))

        let { stageList, awardStatus: awardStatus1 } = await task.findBeanHome(axios, options)
        if (!awardStatus1) {
            stageList = stageList.filter(s => !s.viewed)
            for (let stage of stageList) {
                await task.totask(axios, {
                    ...options,
                    body: {
                        "type": "4_" + stage.stageId,
                        "source": "home",
                        "awardFlag": false,
                        "itemId": stage.stageId
                    }
                })
                await new Promise((resolve, reject) => setTimeout(resolve, 5 * 1000))
            }
        }

        console.info('完成浏览5个任务, 领取京豆中')
        let d1 = await task.totask(axios, {
            ...options,
            body: { "source": "home", "awardFlag": true }
        })
        if (d1 && d1.beanNum) {
            console.reward('京豆', d1.beanNum)
        }
    }
}
module.exports = task