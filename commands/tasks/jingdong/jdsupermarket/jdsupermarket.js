const { w } = require("../sign/common")
// channel 1  18
var jdsupermarket = {
    smtg_sign: async (axios, options) => {
        let params = {
            'appid': 'jdsupermarket',
            functionId: 'smtg_sign',
            body: JSON.stringify({ "channel": '1' }),
            clientVersion: '8.0.0',
            client: 'm',
            _: Date.now(),
        }
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "Referer": "https://jdsupermarket.jd.com/game/?tt=1617003917050",
            },
            url: `https://api.m.jd.com/?` + w(params),
            method: 'get'
        })
        if (data.code === 0) {
            if (data.data.bizCode === 0) {
                if (data.data.result?.addedRewardJBeanCount) {
                    console.reward('京豆', data.data.result?.addedRewardJBeanCount)
                }
            } else {
                console.error(data.data.bizMsg)
            }
        } else {
            console.error('签到失败', data)
        }
    },
    smtg_newHome: async (axios, options) => {
        let params = {
            'appid': 'jdsupermarket',
            functionId: 'smtg_newHome',
            body: JSON.stringify({ "channel": "1" }),
            clientVersion: '8.0.0',
            client: 'm',
            _: Date.now(),
        }
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "Referer": "https://jdsupermarket.jd.com/game/?tt=1617003917050",
            },
            url: `https://api.m.jd.com/?` + w(params),
            method: 'get'
        })
        return data.data.result
    },
    smtg_queryShopTask: async (axios, options) => {
        let params = {
            'appid': 'jdsupermarket',
            functionId: 'smtg_queryShopTask',
            body: JSON.stringify({ "channel": "1" }),
            clientVersion: '8.0.0',
            client: 'm',
            _: Date.now(),
        }
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "Referer": "https://jdsupermarket.jd.com/game/?tt=1617003917050",
            },
            url: `https://api.m.jd.com/?` + w(params),
            method: 'get'
        })
        return data.data.result
    },
    smtg_obtainShopTaskPrize: async (axios, options) => {
        const { task } = options
        let params = {
            'appid': 'jdsupermarket',
            functionId: 'smtg_obtainShopTaskPrize',
            body: JSON.stringify({ "taskId": task.taskId, "channel": '1' }),
            clientVersion: '8.0.0',
            client: 'm',
            _: Date.now(),
        }
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "Referer": "https://jdsupermarket.jd.com/game/?tt=1617003917050",
            },
            url: `https://api.m.jd.com/?` + w(params),
            method: 'get'
        })
        if (data.code === 0 && data.data.bizCode === 0) {
            console.info('领取蓝币成功', data.data.result.blueCoin)
        } else {
            console.error('领取蓝币失败', data)
        }
    },
    smtg_doShopTask: async (axios, options) => {
        const { task } = options
        let item = {}
        for (let k in task.content) {
            item = task.content[k]
            break
        }
        let params = {
            'appid': 'jdsupermarket',
            functionId: 'smtg_doShopTask',
            body: JSON.stringify({ "taskId": task.taskId, "itemId": item.itemId, "channel": '1' }),
            clientVersion: '8.0.0',
            client: 'm',
            _: Date.now(),
        }
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "Referer": "https://jdsupermarket.jd.com/game/?tt=1617003917050",
            },
            url: `https://api.m.jd.com/?` + w(params),
            method: 'get'
        })
        console.info(`完成进度${data.data.result.finishNum}/${data.data.result.targetNum}`)
    },
    smtg_shopIndex: async (axios, options) => {
        let params = {
            'appid': 'jdsupermarket',
            functionId: 'smtg_shopIndex',
            body: JSON.stringify({ "channel": "1" }),
            clientVersion: '8.0.0',
            client: 'm',
            _: Date.now(),
        }
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "Referer": "https://jdsupermarket.jd.com/game/?tt=1617003917050",
            },
            url: `https://api.m.jd.com/?` + w(params),
            method: 'get'
        })
        return {
            shopId: data.data.result.shopId,
            level: data.data.result.level
        }
    },
    smtg_shelfUpgrade: async (axios, options) => {
        const { shop } = options
        let params = {
            'appid': 'jdsupermarket',
            functionId: 'smtg_shelfUpgrade',
            body: JSON.stringify({
                "shopId": shop.shopId,
                "shelfId": "shelf-1",
                "targetLevel": shop.level + 1,
                "channel": "1"
            }),
            clientVersion: '8.0.0',
            client: 'm',
            _: Date.now(),
        }
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "Referer": "https://jdsupermarket.jd.com/game/?tt=1617003917050",
            },
            url: `https://api.m.jd.com/?` + w(params),
            method: 'get'
        })
        console.log(data)
    },
    smtg_queryPrize: async (axios, options) => {
        let params = {
            'appid': 'jdsupermarket',
            functionId: 'smtg_queryPrize',
            body: JSON.stringify({ "channel": "1" }),
            clientVersion: '8.0.0',
            client: 'm',
            _: Date.now(),
        }
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "Referer": "https://jdsupermarket.jd.com/game/?tt=1617003917050",
            },
            url: `https://api.m.jd.com/?` + w(params),
            method: 'get'
        })
        return data.data.result.prizeList
    },
    smtg_obtainPrize: async (axios, options) => {
        const { prize } = options
        let params = {
            'appid': 'jdsupermarket',
            functionId: 'smtg_obtainPrize',
            body: JSON.stringify({ "prizeId": prize.prizeId, "channel": "1" }),
            clientVersion: '8.0.0',
            client: 'm',
            _: Date.now(),
        }
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "Referer": "https://jdsupermarket.jd.com/game/?tt=1617003917050",
            },
            url: `https://api.m.jd.com/?` + w(params),
            method: 'get'
        })
        if (data.data.bizCode === 0) {
            console.info(data.data)
        } else {
            console.error(data.data.bizMsg)
        }
    },
    smtg_receiveCoin: async (axios, options) => {
        const { body } = options
        let params = {
            'appid': 'jdsupermarket',
            functionId: 'smtg_receiveCoin',
            body: JSON.stringify(body),
            clientVersion: '8.0.0',
            client: 'm',
            _: Date.now(),
        }
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "Referer": "https://jdsupermarket.jd.com/game/?tt=1617003917050",
            },
            url: `https://api.m.jd.com/?` + w(params),
            method: 'get'
        })
        // isUpgradeFlag
        if (data.data.result.currentTurnover) {
            console.info('本次收取营业额', data.data.result.receivedTurnover, '累计收取营业额', data.data.result.currentTurnover, '当前等级营业额上限', data.data.result.maxTurnover)
        } else if (data.data.result.receivedBlue) {
            console.info('本次收取蓝币', data.data.result.receivedBlue, '累计收取蓝币', data.data.result.totalBlue)
        }
        if (data.data.result.isUpgradeFlag) {
            let shop = await jdsupermarket.smtg_shopIndex(axios, options)
            await jdsupermarket.smtg_shelfUpgrade(axios, {
                ...options,
                shop
            })
        }
    },
    doobtainPrize: async (axios, options) => {
        let prizeList = await jdsupermarket.smtg_queryPrize(axios, options)
        //Bean 20; BeanPackage 1000
        let prize = prizeList.find(t => t.type === 3 && t.beanType == 'Bean')
        if (prize) {
            await jdsupermarket.smtg_obtainPrize(axios, {
                ...options,
                prize
            })
        } else {
            console.info('未找到指定的兑换奖品')
        }
    },
    doTask: async (axios, options) => {
        let { userUpgradeBlueVos } = await jdsupermarket.smtg_newHome(axios, options)
        for (let task of userUpgradeBlueVos) {
            await jdsupermarket.smtg_receiveCoin(axios, {
                ...options,
                body: {
                    "type": 5,
                    "id": task.id,
                    "channel": "1"
                }
            })
            await new Promise((resolve, reject) => setTimeout(resolve, 1 * 1000))
        }

        let { taskList: tasks0 } = await jdsupermarket.smtg_queryShopTask(axios, options)
        let willtasks = tasks0.filter(t => t.taskStatus === 0)
        for (let task of willtasks) {
            console.info(task.type, task.title, task.targetNum, task.finishNum)
            let n = task.targetNum - task.finishNum
            let setask = task
            if ([1, 2, 5, 8, 10].indexOf(task.type) !== -1) {
                while (n > 0) {
                    await jdsupermarket.smtg_doShopTask(axios, {
                        ...options,
                        task: setask
                    })
                    await new Promise((resolve, reject) => setTimeout(resolve, 5 * 1000))
                    let { taskList: tasks } = await jdsupermarket.smtg_queryShopTask(axios, options)
                    setask = tasks.find(t => t.taskId === task.taskId)
                    n--
                }
            } else if (task.type === 9) {
                // require('../api/shopmember').jd_shop_member(axios, {...options,shop})
            } else {
                console.error('未实现')
            }
        }

        let { taskList: tasks1 } = await jdsupermarket.smtg_queryShopTask(axios, options)
        willtasks = tasks1.filter(t => t.taskStatus === 1 && t.prizeStatus === 1)
        for (let task of willtasks) {
            console.info(task.type, task.title, task.targetNum, task.finishNum)
            await new Promise((resolve, reject) => setTimeout(resolve, 1 * 1000))
            await jdsupermarket.smtg_obtainShopTaskPrize(axios, {
                ...options,
                task
            })
        }
    }
}
module.exports = jdsupermarket