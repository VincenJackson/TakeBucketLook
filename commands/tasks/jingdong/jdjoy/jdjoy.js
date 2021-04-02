const { lks_sign, transParams, w } = require('./signUtils')
const path = require('path')
const fs = require('fs-extra')

// 宠汪汪
// https://h5.m.jd.com/babelDiy/Zeus/2wuqXrZrhygTQzYA7VufBEpj4amH/index.htm
var pet = {
    getPetTaskConfig: async (axios, options) => {
        let lkt = Date.now()
        let params = {
            'reqSource': 'h5',
            'lks': lks_sign(lkt),
            'lkt': lkt
        }
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": "https://h5.m.jd.com",
                "referer": `https://h5.m.jd.com/`,
            },
            url: `https://jdjoy.jd.com/common/pet/getPetTaskConfig?` + w(params),
            method: 'get'
        })

        if (data.success) {
            console.log('加载游戏任务配置成功')
            return data.datas
        } else {
            throw new Error('加载游戏任务配置失败' + data.errorMessage)
        }
    },
    getFood: async (axios, options) => {
        const { taskType } = options
        let lkt = Date.now()
        let params = {
            'reqSource': 'h5',
            'lks': lks_sign(lkt),
            'lkt': lkt,
            'taskType': taskType
        }
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": "https://h5.m.jd.com",
                "referer": `https://h5.m.jd.com/`,
            },
            url: `https://jdjoy.jd.com/common/pet/getFood?` + w(params),
            method: 'get'
        })
        if (data.success) {
            console.info(`领取狗粮成功`)
        } else {
            console.error(`领取狗粮失败`, data.errorMessage)
        }
    },
    receive: async (axios, options) => {
        let lkt = Date.now()
        let params = {
            'reqSource': 'h5',
            'lks': lks_sign(lkt),
            'lkt': lkt
        }
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": "https://h5.m.jd.com",
                "referer": `https://h5.m.jd.com/`,
            },
            url: `https://jdjoy.jd.com/common/pet/combat/receive?` + w(params),
            method: 'get'
        })
        if (data.success) {
            console.info(`领取奖励成功`)
        } else {
            console.error(`领取奖励失败`, data.errorMessage)
        }
    },
    sharcode: async (axios, options) => {
        let lkt = Date.now()
        let params = {
            'invitePin': '',
            'reqSource': 'h5',
            'lks': lks_sign(lkt),
            'lkt': lkt
        }
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": "https://h5.m.jd.com",
                "referer": `https://h5.m.jd.com/`,
            },
            url: `https://jdjoy.jd.com/common/pet/enterRoom/h5?` + w(params),
            method: 'post',
            data: {}
        })
        console.info('我的宠汪汪助力码', data.data.pin)
    },
    completeGameTask: async (axios, options) => {
        let tasks = await pet.getPetTaskConfig(axios, options)
        let taskStatus_tasks = tasks.filter(t =>
            t.receiveStatus != 'chance_full'
            && ['FeedEveryDay', 'exchange', 'HelpFeed', 'ThreeMeals'].indexOf(t.taskType) === -1
        )
        console.info('剩余未完成任务数', taskStatus_tasks.length)
        // HelpFeed FollowChannel ScanMarket exchange ReserveSku FollowShop
        // SignEveryDay ThreeMeals FollowGood FeedEveryDay InviteUser race
        for (let task of taskStatus_tasks) {
            console.info(task.taskType, task.taskName)
            if (fs.existsSync(path.join(__dirname, './' + task.taskType + '.js'))) {
                await require('./' + task.taskType).doTask(axios, {
                    ...options,
                    task,
                    pet
                })
            } else {
                console.error('未实现的任务', task.taskType, task.taskName)
            }
        }

        console.info('ScanGood', '逛商品得100积分')
        await require('./ScanGood').doTask(axios, {
            ...options
        })
    },
    exchangeJdBean: async (axios, options) => {
        let tasks = await pet.getPetTaskConfig(axios, options)
        let task = tasks.find(t => t.taskType === 'exchange')
        await require('./exchange').doTask(axios, {
            ...options,
            task,
            pet
        })
    },
    ThreeMeals: async (axios, options) => {
        let tasks = await pet.getPetTaskConfig(axios, options)
        let task = tasks.find(t => t.taskType === 'ThreeMeals')
        await require('./ThreeMeals').doTask(axios, {
            ...options,
            task,
            pet
        })
    },
    HelpFeed: async (axios, options) => {
        let tasks = await pet.getPetTaskConfig(axios, options)
        let task = tasks.find(t => t.taskType === 'HelpFeed')
        await require('./HelpFeed').doTask(axios, {
            ...options,
            task,
            pet
        })
    },
    FeedEveryDay: async (axios, options) => {
        let tasks = await pet.getPetTaskConfig(axios, options)
        let task = tasks.find(t => t.taskType === 'FeedEveryDay')
        await require('./FeedEveryDay').doTask(axios, {
            ...options,
            task
        })
    },
    race: async (axios, options) => {
        let tasks = await pet.getPetTaskConfig(axios, options)
        let task = tasks.find(t => t.taskType === 'race')
        await require('./race').doTask(axios, {
            ...options,
            task
        })
    },
    // ? 似乎无效 // fix
    UserSign: async (axios, options) => {
        let lkt = Date.now()
        let params = {
            'reqSource': 'h5',
            'lks': lks_sign(lkt),
            'lkt': lkt,
            'taskType': 'SignEveryDay'
        }
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": "https://h5.m.jd.com",
                "referer": `https://h5.m.jd.com/`,
            },
            url: `https://jdjoy.jd.com/common/pet/sign?` + w(params),
            method: 'get'
        })
        if (data.success) {
            console.info('签到成功')
        } else {
            console.error('签到失败', data.errorMessage)
        }
    }
}
module.exports = pet