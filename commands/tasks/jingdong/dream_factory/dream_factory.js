const { w } = require("../sign/common")
const { buildh5st } = require("./common")
const moment = require("moment")
var dream_factory = {
    GetBoxInfo: async (axios, options) => {
        const { task, counts } = options

        let time = Date.now()
        let params = [
            { key: "_time", value: time },
            { key: "counts", value: counts },
            { key: "taskid", value: task.taskId },
            { key: "zone", value: "dream_factory" }
        ]
        let { _timestamp, _stk, h5st } = await buildh5st(axios, {
            ...options,
            params,
            time
        })

        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "referer": `https://wqsd.jd.com/`,
            },
            url: `https://wq.jd.com/dreamfactory/generator/GetBoxInfo?` + w({
                'zone': 'dream_factory',
                taskid: task.taskId,
                counts: counts,
                '_time': time,
                '_stk': _stk,
                '_ste': 1,
                'h5st': h5st,
                '_': time,
                'sceneval': 2,
                'g_login_type': 1,
                'g_ty': 'ls'
            }),
            method: 'get'
        })
        console.log(data)
    },
    GetUserInfo: async (axios, options) => {
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "referer": `https://wqsd.jd.com/`,
            },
            url: `https://wq.jd.com/dreamfactory/userinfo/GetUserInfo?` + w({
                'zone': 'dream_factory',
                'pin': '',
                'sharePin': '',
                'shareType': '',
                'materialTuanPin': '',
                'materialTuanId': '',
                'source': '',
                '_time': Date.now(),
                '_stk': '_time,materialTuanId,materialTuanPin,pin,sharePin,shareType,source,zone',
                '_ste': 1,
                '_': Date.now(),
                'sceneval': 2,
                'g_login_type': 1,
                'g_ty': 'ls'
            }),
            method: 'get'
        })
        return data.data
    },
    GiveNewUserElectric: async (axios, options) => {
        const { product } = options
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "referer": `https://wqsd.jd.com/`,
            },
            url: `https://wq.jd.com/dreamfactory/userinfo/GiveNewUserElectric?` + w({
                'zone': 'dream_factory',
                'action': 'give',
                'productionId': product.productionId,
                '_time': Date.now(),
                '_stk': '_time,action,productionId,zone',
                '_ste': 1,
                '_': Date.now(),
                'sceneval': 2,
                'g_login_type': 1,
                'g_ty': 'ls'
            }),
            method: 'get'
        })
        console.log(data)
    },
    QueryHireReward: async (axios, options) => {
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "referer": `https://wqsd.jd.com/`,
            },
            url: `https://wq.jd.com/dreamfactory/friend/QueryHireReward?` + w({
                'zone': 'dream_factory',
                '_time': Date.now(),
                '_stk': '_time,zone',
                '_ste': 1,
                '_': Date.now(),
                'sceneval': 2,
                'g_login_type': 1,
                'g_ty': 'ls'
            }),
            method: 'get'
        })
        return data.data?.hireReward || []
    },
    HireAward: async (axios, options) => {
        const { hr } = options
        let time = Date.now()
        let params = [
            { key: "_time", value: time },
            { key: "date", value: hr.date },
            { key: "type", value: hr.type },
            { key: "zone", value: "dream_factory" }
        ]
        let { _timestamp, _stk, h5st } = await buildh5st(axios, {
            ...options,
            params,
            time
        })
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "referer": `https://wqsd.jd.com/`,
            },
            url: `https://wq.jd.com/dreamfactory/friend/HireAward?` + w({
                'zone': 'dream_factory',
                'date': hr.date,
                'type': hr.type,
                '_time': time,
                '_stk': _stk,
                '_ste': 1,
                'h5st': h5st,
                '_': time,
                'sceneval': 2,
                'g_login_type': 1,
                'g_ty': 'ls'
            }),
            method: 'get'
        })
        if (data.ret === 0) {
            console.info('奖励领取成功')
        } else {
            console.error('奖励领取失败', data)
        }
    },
    GetUserTaskStatusList: async (axios, options) => {
        let { data } = await axios.request({
            headers: {
                "referer": `https://wqsd.jd.com/`,
                "X-Requested-With": "com.jd.pingou",
                // user-agent不同，获得的任务列表也不同
                "user-agent": "jdpingou;android;4.5.0;9;;network/wifi;model/VKY-AL00;appBuild/16089;partner/huawei01;Mozilla/5.0 (Linux; Android 9; VKY-AL00 Build/HUAWEIVKY-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/86.0.4240.198 Mobile Safari/537.36"
            },
            url: `https://wq.jd.com/newtasksys/newtasksys_front/GetUserTaskStatusList?` + w({
                'source': 'dreamfactory',
                'bizCode': 'dream_factory',
                '_time': Date.now(),
                '_stk': '_time,bizCode,source',
                '_ste': 1,
                '_': Date.now(),
                'sceneval': 2,
                'g_login_type': 1,
                'g_ty': 'ls'
            }),
            method: 'get'
        })
        return data.data.userTaskStatusList
    },
    Award: async (axios, options) => {
        const { task } = options

        let time = Date.now()
        let params = [
            { key: "_time", value: time },
            { key: "bizCode", value: task.bizCode },
            { key: "source", value: "dreamfactory" },
            { key: "taskId", value: task.taskId }
        ]
        let { _timestamp, _stk, h5st } = await buildh5st(axios, {
            ...options,
            params,
            time
        })

        let { data } = await axios.request({
            headers: {
                "referer": `https://wqsd.jd.com/`,
                "X-Requested-With": "com.jd.pingou",
                // user-agent不同，允许获取的奖励也不同，做好同列表的一致
                "user-agent": "jdpingou;android;4.5.0;9;;network/wifi;model/VKY-AL00;appBuild/16089;partner/huawei01;Mozilla/5.0 (Linux; Android 9; VKY-AL00 Build/HUAWEIVKY-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/86.0.4240.198 Mobile Safari/537.36"
            },
            url: `https://wq.jd.com/newtasksys/newtasksys_front/Award?` + w({
                'source': 'dreamfactory',
                'bizCode': task.bizCode,
                taskId: task.taskId,
                '_time': time,
                '_stk': _stk,
                '_ste': 1,
                'h5st': h5st,
                '_': time,
                'sceneval': 2,
                'g_login_type': 1,
                'g_ty': 'ls'
            }),
            method: 'get'
        })
        if (data?.data?.prizeInfo) {
            console.info('获得电力', data?.data?.prizeInfo)
        }
    },
    InvestElectric: async (axios, options) => {
        const { product } = options

        let time = Date.now()
        let params = [
            { key: "_time", value: time },
            { key: "productionId", value: product.productionId },
            { key: "zone", value: "dream_factory" }
        ]
        let { _timestamp, _stk, h5st } = await buildh5st(axios, {
            ...options,
            params,
            time
        })

        let { data } = await axios.request({
            headers: {
                "referer": `https://wqsd.jd.com/`,
                "X-Requested-With": "com.jd.pingou",
                "user-agent": "jdpingou;android;4.5.0;9;;network/wifi;model/VKY-AL00;appBuild/16089;partner/huawei01;Mozilla/5.0 (Linux; Android 9; VKY-AL00 Build/HUAWEIVKY-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/86.0.4240.198 Mobile Safari/537.36"
            },
            url: `https://wq.jd.com/dreamfactory/userinfo/InvestElectric?` + w({
                'zone': 'dream_factory',
                "productionId": product.productionId,
                '_time': time,
                '_stk': _stk,
                '_ste': 1,
                'h5st': h5st,
                '_': time,
                'sceneval': 2,
                'g_login_type': 1,
                'g_ty': 'ls'
            }),
            method: 'get'
        })
        console.log(data)
    },
    QueryCurrentElectricityQuantity: async (axios, options) => {
        const { product } = options
        let time = Date.now()
        let params = [
            { key: "_time", value: time },
            { key: "factoryid", value: product.factoryId },
            { key: "zone", value: "dream_factory" }
        ]
        let { _timestamp, _stk, h5st } = await buildh5st(axios, {
            ...options,
            params,
            time
        })

        let { data } = await axios.request({
            headers: {
                "referer": `https://wqsd.jd.com/`,
                "X-Requested-With": "com.jd.pingou",
                "user-agent": "jdpingou;android;4.5.0;9;;network/wifi;model/VKY-AL00;appBuild/16089;partner/huawei01;Mozilla/5.0 (Linux; Android 9; VKY-AL00 Build/HUAWEIVKY-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/86.0.4240.198 Mobile Safari/537.36"
            },
            url: `https://wq.jd.com/dreamfactory/generator/QueryCurrentElectricityQuantity?` + w({
                'zone': 'dream_factory',
                "factoryid": product.factoryId,
                '_time': time,
                '_stk': _stk,
                '_ste': 1,
                'h5st': h5st,
                '_': time,
                'sceneval': 2,
                'g_login_type': 1,
                'g_ty': 'ls'
            }),
            method: 'get'
        })
        return data.data
    },
    DoTask: async (axios, options) => {
        const { task, configExtra } = options
        let time = Date.now()
        let params = [
            { key: "_time", value: time },
            { key: "bizCode", value: task.bizCode },
            { key: "configExtra", value: JSON.stringify(configExtra || {}) },
            { key: "source", value: "dreamfactory" },
            { key: "taskId", value: task.taskId }
        ]
        let { _timestamp, _stk, h5st } = await buildh5st(axios, {
            ...options,
            params,
            time
        })
        let { data } = await axios.request({
            headers: {
                "referer": `https://wqsd.jd.com/`,
                "X-Requested-With": "com.jd.pingou",
                "user-agent": "jdpingou;android;4.5.0;9;;network/wifi;model/VKY-AL00;appBuild/16089;partner/huawei01;Mozilla/5.0 (Linux; Android 9; VKY-AL00 Build/HUAWEIVKY-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/86.0.4240.198 Mobile Safari/537.36"
            },
            url: `https://m.jingxi.com/newtasksys/newtasksys_front/DoTask?` + w({
                'bizCode': task.bizCode,
                "taskId": task.taskId,
                "configExtra": JSON.stringify(configExtra || {}),
                "source": "dreamfactory",
                '_time': time,
                '_stk': _stk,
                '_ste': 1,
                'h5st': h5st,
                '_': time,
                'sceneval': 2,
                'g_login_type': 1,
                'g_ty': 'ls'
            }),
            method: 'get'
        })
        if (data.ret === 0) {
            console.info('任务成功完成')
        } else {
            console.error('任务完成失败', data)
        }
    },
    CollectCurrentElectricity: async (axios, options) => {
        const { product, doubleflag } = options
        let time = Date.now()

        let params = [
            { key: "_time", value: time },
            { key: "apptoken", value: "" },
            { key: "doubleflag", value: doubleflag },
            { key: "factoryid", value: product.factoryId },
            { key: "pgtimestamp", value: "" },
            { key: "phoneID", value: "" },
            { key: "zone", value: "dream_factory" }
        ]
        let { _timestamp, _stk, h5st } = await buildh5st(axios, {
            ...options,
            params,
            time
        })

        let { data } = await axios.request({
            headers: {
                "user-agent": "jdpingou;android;4.5.0;9;;network/wifi;model/VKY-AL00;appBuild/16089;partner/huawei01;Mozilla/5.0 (Linux; Android 9; VKY-AL00 Build/HUAWEIVKY-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/86.0.4240.198 Mobile Safari/537.36",
                "X-Requested-With": "com.jd.pingou",
                Referer: "https://wqsd.jd.com/"
            },
            url: `https://wq.jd.com/dreamfactory/generator/CollectCurrentElectricity?` + w({
                zone: 'dream_factory',
                apptoken: '',
                pgtimestamp: "",
                phoneID: "",
                factoryid: product.factoryId,
                doubleflag: doubleflag,
                timeStamp: 'undefined',
                '_time': time,
                '_stk': _stk,
                '_ste': 1,
                'h5st': h5st,
                '_': time,
                'sceneval': 2,
                'g_login_type': 1,
                'g_ty': 'ls'
            }),
            method: 'GET'
        })
        if (data.ret === 0) {
            console.info('搜集电力成功', data.data.CollectElectricity)
        } else {
            console.error('搜集电力失败 直接领取', data)
        }
    },
    doCheckCompleteNotify: async (axios, options) => {
        let user = await dream_factory.GetUserInfo(axios, options)
        if (!user) {
            return
        }
        user?.productionList.map(p => {
            console.info(`factoryId:${p.factoryId}, productionId:${p.productionId}, 进度:${p.investedElectric}/${p.needElectric}(${Number(p.investedElectric * 100 / p.needElectric).toFixed(2)}%), 是否可兑换:${p.exchangeStatus ? '可以' : '不能'}`)
            if (p.exchangeStatus === 1) {
                console.notify('你京喜工厂的商品已生产完毕，请尽快兑换以免过期')
            }
        })
    },
    init: async (axios, options) => {
        let user = await dream_factory.GetUserInfo(axios, options)
        user?.productionList.map(p => {
            console.info(`factoryId:${p.factoryId}, productionId:${p.productionId}, 进度:${p.investedElectric}/${p.needElectric}(${Number(p.investedElectric * 100 / p.needElectric).toFixed(2)}%), 是否可兑换:${p.exchangeStatus ? '可以' : '不能'}`)
        })
        if (user.productionStage.productionStageAwardStatus === 0) {
            console.error('你尚未选择要生产的产品')
            return
        }
        return user
    },
    doCollectElectricityTask: async (axios, options) => {
        let user = await dream_factory.init(axios, options)
        if (!user) {
            return
        }
        let product = user.productionList[0]

        let data = await dream_factory.QueryCurrentElectricityQuantity(axios, {
            ...options,
            product
        })
        await dream_factory.CollectCurrentElectricity(axios, {
            ...options,
            doubleflag: data.doubleElectricityFlag,
            product
        })
        await dream_factory.InvestElectric(axios, {
            ...options,
            product
        })
    },
    doTask: async (axios, options) => {
        let user = await dream_factory.init(axios, options)
        if (!user) {
            return
        }
        let tasks = await dream_factory.GetUserTaskStatusList(axios, options)
        let wwwtasks = tasks.filter(task => task.status === 1 && task.completedTimes < task.targetTimes)
        for (let task of wwwtasks) {
            console.info('尝试完成任务中', task.taskType, task.taskName)
            if (task.taskType === 2) {
                await dream_factory.DoTask(axios, {
                    ...options,
                    task
                })
                if (task?.taskConfigExtra?.second) {
                    await new Promise((resolve, reject) => setTimeout(resolve, task?.taskConfigExtra?.second * 1000))
                } else {
                    await new Promise((resolve, reject) => setTimeout(resolve, 1 * 1000))
                }
            } else if (task.taskType === 6) {
                let { data } = await axios.request({
                    headers: {
                        "user-agent": "jdpingou;android;4.5.0;9;;network/wifi;model/VKY-AL00;appBuild/16089;partner/huawei01;Mozilla/5.0 (Linux; Android 9; VKY-AL00 Build/HUAWEIVKY-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/86.0.4240.198 Mobile Safari/537.36",
                        "X-Requested-With": "com.jd.pingou",
                        "content-type": 'application/json',
                        Referer: "https://wqsd.jd.com/"
                    },
                    url: `https://wq.jd.com/mcoss/data/get?` + w({
                        func: 'pinlike',
                        recpos: 5914,
                        param: JSON.stringify({ "pagenum": 1, "count": 20 }),
                        _: Date.now(),
                        sceneval: 2,
                        g_login_type: 1,
                        g_ty: 'ls'
                    }),
                    method: 'GET'
                })
                let userStatusConfigExtra = {}
                try {
                    userStatusConfigExtra = JSON.parse(task.userStatusConfigExtra)
                } catch (err) { }
                let n = task.targetTimes - task.completedTimes
                for (let good of data.data.feeds) {
                    if (n <= 0) {
                        break
                    }
                    await dream_factory.DoTask(axios, {
                        ...options,
                        task,
                        configExtra: { "hasBrowseSkuIds": (userStatusConfigExtra.hasBrowseSkuIds || '') + ',' + good.id }
                    })
                    await new Promise((resolve, reject) => setTimeout(resolve, 5 * 1000))
                    n--
                }
            } else if (task.taskType === 9) {
                let n = task.targetTimes - task.completedTimes
                let m = 1
                while (n > 0) {
                    await dream_factory.GetBoxInfo(axios, {
                        ...options,
                        task,
                        counts: m
                    })
                    m++
                    n--
                }
            } else {
                console.error('未实现', task.taskType, task.taskName)
            }
        }

        tasks = await dream_factory.GetUserTaskStatusList(axios, options)
        let willtasks = tasks.filter(t => t.awardStatus === 2 && t.completedTimes >= t.targetTimes)
        for (let task of willtasks) {
            console.info('尝试领取奖励中', task.taskType, task.taskName)
            await dream_factory.Award(axios, {
                ...options,
                task
            })
            await new Promise((resolve, reject) => setTimeout(resolve, 1 * 1000))
        }

        let hireRewards = await dream_factory.QueryHireReward(axios, options)
        for (let hr of hireRewards) {
            if (moment().format('YYYYMMDD') !== hr.date) {
                await dream_factory.HireAward(axios, {
                    ...options,
                    hr
                })
                await new Promise((resolve, reject) => setTimeout(resolve, 1 * 1000))
            }
        }
    },
}
module.exports = dream_factory