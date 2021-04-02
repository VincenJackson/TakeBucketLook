const { lks_sign, transParams, w } = require('./signUtils')
const { msg } = require('./common')
var Race = {
    racestart: async (axios, options) => {
        let lkt = Date.now()
        let params = {
            'reqSource': 'h5',
            'lks': lks_sign(lkt),
            'lkt': lkt,
            'iconCode': 'race_match'
        }
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": "https://h5.m.jd.com",
                "referer": `https://h5.m.jd.com/`,
            },
            url: `https://jdjoy.jd.com/common/pet/icon/click?` + w(params),
            method: 'get'
        })
        if (data.success) {
            console.info(`开始宠物赛跑`)
        } else {
            console.error(`开始宠物赛跑失败`, data.errorMessage)
        }
    },
    doMatch: async (axios, options) => {
        const { pet } = options
        let lkt = Date.now()
        let params = {
            'reqSource': 'h5',
            'lks': lks_sign(lkt),
            'lkt': lkt,
            'teamLevel': 2
        }
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": "https://h5.m.jd.com",
                "referer": `https://h5.m.jd.com/`,
            },
            url: `ttps://jdjoy.jd.com/common/pet/combat/match?` + w(params),
            method: 'get'
        })
        if (data.success) {
            if (data.data.petRaceResult === 'matching') {
                console.info('匹配中')
            } else if (data.data.petRaceResult === 'participate') {
                console.info('参与中')
                return {
                    flag: true,
                    result: data.data.petRaceResult
                }
            } else if (data.data.petRaceResult === 'unbegin') {
                console.info('未开始')
            } else {
                console.error('参与失败', data)
            }
            return {
                flag: false,
                result: data.data.petRaceResult
            }
        } else {
            console.error(`匹配失败`, data.errorMessage)
            if (data.errorMessage.indexOf('有奖励未领取') !== -1) {
                console.info('尝试领取奖励')
                await pet.receive(axios, options)
            }
            return {
                flag: false
            }
        }
    },
    getdetail: async (axios, options) => {
        let lkt = Date.now()
        let params = {
            'reqSource': 'h5',
            'lks': lks_sign(lkt),
            'lkt': lkt,
            'help': false
        }
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": "https://h5.m.jd.com",
                "referer": `https://h5.m.jd.com/`,
            },
            url: `https://jdjoy.jd.com/common/pet/combat/detail/v2??` + w(params),
            method: 'get'
        })
        if (data.success) {
            console.info('本次PK人员', data.data.raceUsers.map(u => u.nickName).join(' <=> '))
            let t = new Date(data.currentTime)
            let a = 75600 - (3600 * t.getHours() + 60 * t.getMinutes() + t.getSeconds())
            console.info('剩余时间', `${Math.floor(a / 3600)}h ${Math.floor(a % 3600 / 60)}m ${Math.floor(a % 60)}s`)
        } else {
            console.error('获取PK信息失败', data.errorMessage)
        }
    },
    doTask: async (axios, options) => {
        const { task, pet } = options
        console.log(`开始完成【${task.taskName}】任务中`)

        await Race.racestart(axios, {
            ...options
        })
        await new Promise((resolve, reject) => setTimeout(resolve, 5 * 1000))
        let n = 10
        do {
            let { flag, result } = await Race.doMatch(axios, {
                pet,
                ...options
            })
            if (result === 'time_over' || result === 'unbegin') {
                break
            }
            if (flag) {
                await pet.getFood(axios, {
                    ...options,
                    taskType: 'race'
                })
                break
            }
            await new Promise((resolve, reject) => setTimeout(resolve, 5 * 1000))
            n--
        } while (n > 0)
        await Race.getdetail(axios, {
            ...options
        })
    }
}
module.exports = Race