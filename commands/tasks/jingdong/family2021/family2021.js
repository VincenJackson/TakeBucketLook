const { reqApiSign } = require('../api/client')
const { w } = require('../sign/common')

var family2021 = {
    homeHeadBanner: {},
    familyHomeAndInvitePageFloor: async (axios, options) => {
        let { data } = await reqApiSign(axios, {
            ...options,
            functionId: 'familyHomeAndInvitePageFloor',
            body: {
                "ClientRiskInfo": {
                    "eid": -1,
                    "fp": -1,
                    "orgType": 2,
                    "platform": 3,
                    "shshshfp": -1,
                    "shshshfpa": -1,
                    "shshshfpb": -1
                },
                "channel": "myjd",
                "clientType": "android",
                "userChannel": "myjd",
                "version": "6.3"
            }
        })
        family2021.homeHeadBanner = data.homePageFloor.homeHeadBanner
        return data.homePageFloor
    },
    fetchHomeTasks: async (axios, options) => {
        console.info('获取幸福收益任务中')
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
            },
            url: family2021.homeHeadBanner.rnGameActionUrl,
            method: 'get'
        })
        let s = data.indexOf('h5Config =') + 10
        let e = data.indexOf('var sharePlatform')
        let taskJson = JSON.parse(data.substr(s, e - s - 2))
        return {
            actToken: taskJson.customizedConfig.actToken,
            activeId: taskJson.customizedConfig.activeId,
            tasks: taskJson.customizedConfig.config.tasks
        }
    },
    fetchHomeStatus: async (axios, options) => {
        const { activeId, actToken } = options
        console.info('获取任务状态中')
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "referer": family2021.homeHeadBanner.rnGameActionUrl,
            },
            url: `https://wq.jd.com/activep3/family/family_query?` + w({
                'activeid': activeId,
                'token': actToken,
                'sceneval': '2',
                't': Date.now(),
                'callback': 'CheckParamsV',
                '_': Date.now()
            }),
            method: 'get'
        })
        let s = data.indexOf('try{ CheckParamsV(') + 18
        let e = data.indexOf(');}catch(e){}')
        return JSON.parse(data.substr(s, e - s)).tasklist
    },
    family_draw: async (axios, options) => {
        const { activeId, actToken } = options
        console.info('兑换京豆中')
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "referer": family2021.homeHeadBanner.rnGameActionUrl,
            },
            url: `https://wq.jd.com/activep3/family/family_draw?` + w({
                'activeid': activeId,
                'token': actToken,
                'sceneval': '2',
                't': Date.now(),
                'level': 5,
                'active': 'opensvc_sns_act_1609412610564',
                'type': '2',
                'callback': 'CheckParamsV',
                '_': Date.now()
            }),
            method: 'get'
        })
        let s = data.indexOf('try{ CheckParamsV(') + 18
        let e = data.indexOf(');}catch(e){}')
        let dd = JSON.parse(data.substr(s, e - s))
        if (dd.ret === 0) {
            console.info('兑换成功', data)
        } else {
            console.error('兑换失败', data)
        }
    },
    completeFamilyTask: async (axios, options) => {
        const { activeId, actToken, taskid } = options
        console.info('完成任务中')
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "Referer": family2021.homeHeadBanner.rnGameActionUrl,
                "origin": "https://anmp.jd.com",
            },
            url: `https://wq.jd.com/activep3/family/family_task?` + w({
                'activeid': activeId,
                'token': actToken,
                'sceneval': '2',
                't': Date.now(),
                'taskid': taskid,
                'callback': 'CheckParamso',
                '_': Date.now()
            }),
            method: 'GET'
        })
        let s = data.indexOf('try{ CheckParamso(') + 18
        let e = data.indexOf(');}catch(e){}')
        let res = JSON.parse(data.substr(s, e - s))
        if (res.ret === 0) {
            console.log(`完成任务[${activeId}, ${taskid}]成功`)
            return true
        } else {
            console.error(`完成任务[${activeId}, ${taskid}]失败`, res.ret)
            return false
        }
    },
    BatchGetShopInfoByVenderId: async (axios, options) => {
        const { activeId, actToken, venderIds } = options
        console.info('获取幸福收益任务中')
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "referer": family2021.homeHeadBanner.rnGameActionUrl,
            },
            url: `https://wqshop.jd.com/mshop/BatchGetShopInfoByVenderId?` + w({
                'activeid': activeId,
                'token': actToken,
                'sceneval': '2',
                't': Date.now(),
                'venderIds': venderIds,
                '_': Date.now()
            }),
            method: 'get'
        })

        return data.data.map(d => ({
            shopId: d.shopId,
            shopName: d.shopInfo.shopName,
            venderId: d.shopInfo.venderId,
        }))
    },
    AddShopFav: async (axios, options) => {
        const { activeId, actToken, shop } = options
        console.info(`关注[${shop.shopName}]店铺中`)
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "referer": family2021.homeHeadBanner.rnGameActionUrl,
            },
            url: `https://wq.jd.com/fav/shop/AddShopFav?` + w({
                'activeid': activeId,
                'token': actToken,
                'sceneval': 2,
                't': Date.now(),
                'venderId': shop.venderId,
                '_': Date.now()
            }),
            method: 'get'
        })
        if (data.iRet === '0') {
            console.info(`关注[${shop.shopName}]成功`)
        } else {
            console.error(`关注[${shop.shopName}]失败`)
        }
    },
    doOtherTask: async (axios, options) => {
        const { activeId, actToken } = options
        console.info('完成其他任务中')
        let tasks = await family2021.fetchHomeStatus(axios, {
            ...options,
            activeId,
            actToken
        })
        let willtasks = tasks.filter(t => t.isdo === 1 && t.taskid !== '5fed97ce5da81a8c069810df')
        for (let task of willtasks) {
            console.info('尝试完成任务', task.taskid)
            if (!task.times) { // times 倒计时
                await family2021.completeFamilyTask(axios, {
                    ...options,
                    activeId,
                    actToken,
                    taskid: task.taskid
                })
            }
        }

        // '5fed97ce5da81a8c069810dd',  // 美食
        // '5fed97ce5da81a8c069810df',  // 健身
        // '600e29f6986178004811bdb0',
        // '604f1b568b02de0050b515b7',  // 逛街

        let willtasks1 = tasks.find(t => t.isdo === 1 && t.taskid === '5fed97ce5da81a8c069810df')
        if (willtasks1) {
            let t = 20 * 60
            do {
                console.info('尝试完成任务', willtasks1.taskid)
                await new Promise((resolve, reject) => setTimeout(resolve, 5 * 1000))
                let flag = await family2021.completeFamilyTask(axios, {
                    ...options,
                    activeId,
                    actToken,
                    taskid: willtasks1.taskid
                })
                t -= 5
                if (t <= 0 || !flag) {
                    break
                }
            } while (true)
            console.log('健身 任务完成')
        }
    },
    doDrawTask: async (axios, options) => {
        await family2021.familyHomeAndInvitePageFloor(axios, options)

        let { activeId, actToken, tasks } = await family2021.fetchHomeTasks(axios, options)
        await family2021.family_draw(axios, {
            ...options,
            activeId,
            actToken
        })
    },
    doTask: async (axios, options) => {
        await family2021.familyHomeAndInvitePageFloor(axios, options)

        let { activeId, actToken, tasks } = await family2021.fetchHomeTasks(axios, options)
        let tasks_status = await family2021.fetchHomeStatus(axios, {
            ...options,
            activeId,
            actToken
        })
        let tasks0 = tasks.filter(t => t.taskType === 0).map(t => {
            let ts0 = tasks_status.find(ts => ts.taskid === t._id)
            return {
                ...ts0,
                ...t
            }
        }).filter(t => t.isdo === 1)

        if (tasks0.length) {
            console.log('剩余未完成的关注任务', tasks0.length)
            let tv = {}
            let venderIds = tasks0.map(t => {
                tv[t.taskDetail] = t.taskid
                return t.taskDetail
            }).join(',')
            let shops = await family2021.BatchGetShopInfoByVenderId(axios, {
                ...options,
                activeId,
                actToken,
                venderIds
            })
            for (let shop of shops) {
                await family2021.AddShopFav(axios, {
                    ...options,
                    activeId,
                    actToken,
                    shop
                })
                await family2021.completeFamilyTask(axios, {
                    ...options,
                    activeId,
                    actToken,
                    taskid: tv[shop.venderId]
                })
                await require('../api/shop').DelShopFav(axios, {
                    ...options,
                    referer: 'https://shop.m.jd.com/',
                    params: {
                        shopId: shop.shopId || shop.venderId,
                        venderId: shop.venderId
                    }
                })
                await family2021.fetchHomeStatus(axios, {
                    ...options,
                    activeId,
                    actToken
                })
            }
        } else {
            console.log('已完成所有关注任务')
        }

        await family2021.doOtherTask(axios, {
            ...options,
            activeId,
            actToken
        })
    }
}
module.exports = family2021