const { w } = require("../sign/common")

var car = {
    sign: async (axios, options) => {
        try {
            let { data } = await axios.request({
                headers: {
                    "user-agent": options.userAgent,
                    "origin": `https://h5.m.jd.com`,
                    "referer": `https://h5.m.jd.com/babelDiy/Zeus/44bjzCpzH9GpspWeBzYSqBA7jEtP/index.html`,
                },
                url: `https://car-member.jd.com/api/v1/user/sign?timestamp=` + Date.now(),
                method: 'post'
            })
            console.info('已签到', data.data.signDays, '天', '获得赛点', data.data.point)
        } catch (err) {
            console.error('今天已签到')
        }
    },
    beancheck: async (axios, options) => {
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": `https://h5.m.jd.com`,
                "referer": `https://h5.m.jd.com/babelDiy/Zeus/44bjzCpzH9GpspWeBzYSqBA7jEtP/index.html`,
            },
            url: `https://car-member.jd.com/api/v1/user/exchange/bean/check?timestamp=` + Date.now(),
            method: 'get'
        })
        console.info(data.data)
        return data.data.result
    },
    detail: async (axios, options) => {
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": `https://h5.m.jd.com`,
                "referer": `https://h5.m.jd.com/babelDiy/Zeus/44bjzCpzH9GpspWeBzYSqBA7jEtP/index.html`,
            },
            url: `https://car-member.jd.com/api/v2/user/detail?timestamp=` + Date.now(),
            method: 'get'
        })
        console.info('已有赛点', data.data.remainPoint)
        return {
            point: data.data.remainPoint,
            sign: data.data.signList.find(s => s.status == 2)
        }
    },
    doSign: async (axios, options) => {
        let { point, sign } = await car.detail(axios, options)
        if (!sign) {
            console.error('今日已签到')
        } else {
            await car.sign(axios, options)
        }
        if (point >= 500) {
            console.info('赛点>=500,可以兑换京豆了')
            await car.beancheck(axios, options)
        }
    },
    mission: async (axios, options) => {
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": `https://h5.m.jd.com`,
                "referer": `https://h5.m.jd.com/babelDiy/Zeus/44bjzCpzH9GpspWeBzYSqBA7jEtP/index.html`,
            },
            url: `https://car-member.jd.com/api/v1/user/mission?timestamp=` + Date.now(),
            method: 'get'
        })
        return data.data.missionList
    },
    domission: async (axios, options) => {
        try {
            const { task } = options
            let { data } = await axios.request({
                headers: {
                    "user-agent": options.userAgent,
                    "origin": `https://h5.m.jd.com`,
                    "activityid": "39443aee3ff74fcb806a6f755240d127",
                    "referer": `https://h5.m.jd.com/babelDiy/Zeus/44bjzCpzH9GpspWeBzYSqBA7jEtP/index.html`,
                    "content-type": 'application/json',
                    "X-Requested-With": "com.jingdong.app.mall"
                },
                url: `https://car-member.jd.com/api/v1/game/mission?timestamp=` + Date.now(),
                method: 'post',
                data: { "missionId": task.missionId }
            })
            console.info(data)
        } catch (err) {
            console.error('任务已完成')
        }
    },
    receive: async (axios, options) => {
        try {
            const { task } = options
            let { data } = await axios.request({
                headers: {
                    "user-agent": options.userAgent,
                    "origin": `https://h5.m.jd.com`,
                    "activityid": "39443aee3ff74fcb806a6f755240d127",
                    "referer": `https://h5.m.jd.com/babelDiy/Zeus/44bjzCpzH9GpspWeBzYSqBA7jEtP/index.html`,
                    "content-type": 'application/json',
                    "X-Requested-With": "com.jingdong.app.mall"
                },
                url: `https://car-member.jd.com/api/v1/user/mission/receive?timestamp=` + Date.now(),
                method: 'post',
                data: { "missionId": task.missionId }
            })
            console.info(data)
        } catch (err) {
            console.error('奖励已领取')
        }
    },
    doTasks: async (axios, options) => {
        let tasks = await car.mission(axios, options)
        let willtasks = tasks.filter(t => t.missionStatus == 0 && [1, 5].indexOf(t.missionType) !== -1)
        for (let task of willtasks) {
            console.info('开始完成任务', task.missionType, task.missionName)
            await car.domission(axios, {
                ...options,
                task
            })
            await new Promise((resolve, reject) => setTimeout(resolve, 2 * 1000))
            await car.receive(axios, {
                ...options,
                task
            })
        }
    }
}
module.exports = car