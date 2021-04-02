const { transParams, w } = require('../sign/common')
const { TryNextEvent } = require('../../../../utils/EnumError')

var dailySpeed = {
    flyTask_state: async (axios, options) => {
        let params = {
            'appid': 'memberTaskCenter',
            functionId: 'flyTask_state',
            body: JSON.stringify({ "source": "game" }),
            _: Date.now(),
        }
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "Referer": "https://h5.m.jd.com/babelDiy/Zeus/6yCQo2eDJPbyPXrC3eMCtMWZ9ey/index.html",
            },
            url: `https://api.m.jd.com/?` + w(params),
            method: 'get'
        })
        console.info('本次空间站', data.data.destination, '距离', data.data.distance, '已完成距离', data.data.done_distance)
        return data.data
    },
    flyTask_start: async (axios, options) => {
        const { task } = options
        let params = {
            'appid': 'memberTaskCenter',
            functionId: 'flyTask_start',
            body: JSON.stringify({ "source": "game", "source_id": task.source_id }),
            _: Date.now(),
        }
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "Referer": "https://h5.m.jd.com/babelDiy/Zeus/6yCQo2eDJPbyPXrC3eMCtMWZ9ey/index.html",
            },
            url: `https://api.m.jd.com/?` + w(params),
            method: 'get'
        })
        if (data.data.task_status === 1) {
            console.info('任务开始成功')
        } else {
            console.error('任务开始失败', data)
        }
    },
    spaceEvent_list: async (axios, options) => {
        let params = {
            'appid': 'memberTaskCenter',
            functionId: 'spaceEvent_list',
            body: JSON.stringify({ "source": "game" }),
            _: Date.now(),
        }
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "Referer": "https://h5.m.jd.com/babelDiy/Zeus/6yCQo2eDJPbyPXrC3eMCtMWZ9ey/index.html",
            },
            url: `https://api.m.jd.com/?` + w(params),
            method: 'get'
        })
        return data.data
    },
    spaceEvent_handleEvent: async (axios, options) => {
        const { event } = options
        let option = event.options.find(t => t.energy > 0)
        let params = {
            'appid': 'memberTaskCenter',
            functionId: 'spaceEvent_handleEvent',
            body: JSON.stringify({ "source": "game", "eventId": event.id, "option": option.value }),
            t: Date.now(),
            _: Date.now(),
        }
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "Referer": "https://h5.m.jd.com/babelDiy/Zeus/6yCQo2eDJPbyPXrC3eMCtMWZ9ey/index.html",
            },
            url: `https://api.m.jd.com/?` + w(params),
            method: 'get'
        })
        console.info('获得事件奖励', data.data.energy.distance || 0)
    },
    energyProp_usalbeList: async (axios, options) => {
        let params = {
            'appid': 'memberTaskCenter',
            functionId: 'energyProp_usalbeList',
            body: JSON.stringify({ "source": "game" }),
            _: Date.now(),
        }
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "Referer": "https://h5.m.jd.com/babelDiy/Zeus/6yCQo2eDJPbyPXrC3eMCtMWZ9ey/index.html",
            },
            url: `https://api.m.jd.com/?` + w(params),
            method: 'get'
        })
        return data.data
    },
    energyProp_list: async (axios, options) => {
        let params = {
            'appid': 'memberTaskCenter',
            functionId: 'energyProp_list',
            body: JSON.stringify({ "source": "game" }),
            _: Date.now(),
        }
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "Referer": "https://h5.m.jd.com/babelDiy/Zeus/6yCQo2eDJPbyPXrC3eMCtMWZ9ey/index.html",
            },
            url: `https://api.m.jd.com/?` + w(params),
            method: 'get'
        })

        return data.data
    },
    energyProp_gain: async (axios, options) => {
        const { prop } = options
        let params = {
            'appid': 'memberTaskCenter',
            functionId: 'energyProp_gain',
            body: JSON.stringify({ "source": "game", "energy_id": prop.id }),
            _: Date.now(),
        }
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "Referer": "https://h5.m.jd.com/babelDiy/Zeus/6yCQo2eDJPbyPXrC3eMCtMWZ9ey/index.html",
            },
            url: `https://api.m.jd.com/?` + w(params),
            method: 'get'
        })
        console.info(data.data.title, data.data.value)
    },
    energyProp_use: async (axios, options) => {
        const { energy } = options
        let params = {
            'appid': 'memberTaskCenter',
            functionId: 'energyProp_use',
            body: JSON.stringify({ "source": "game", "energy_id": energy.id }),
            _: Date.now(),
        }
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "Referer": "https://h5.m.jd.com/babelDiy/Zeus/6yCQo2eDJPbyPXrC3eMCtMWZ9ey/index.html",
            },
            url: `https://api.m.jd.com/?` + w(params),
            method: 'get'
        })
        if (data.code === 0) {
            if (data.data?.add_distance) {
                console.info('距离增加成功', data.data.add_distance)
            }
            if (data.data?.beans_num) {
                console.reward('京豆', data.data.beans_num)
            }
        } else {
            console.error('距离增加失败', data)
        }
    },
    doTask: async (axios, options) => {
        let task = await dailySpeed.flyTask_state(axios, options)
        if (task.task_status === 0) {
            console.info('尝试启动任务')
            await dailySpeed.flyTask_start(axios, {
                ...options,
                task
            })
        } else {
            console.error('任务已经启动了')
        }

        let events = await dailySpeed.spaceEvent_list(axios, options)
        let willevents = events.filter(e => e.status === 1)
        console.info('剩余未完成事件', willevents.length)
        for (let event of willevents) {
            await dailySpeed.spaceEvent_handleEvent(axios, {
                ...options,
                event
            })
        }

        console.info('尝试领取燃料奖励')
        let energys = await dailySpeed.energyProp_usalbeList(axios, options)
        for (let energy of energys) {
            await dailySpeed.energyProp_use(axios, {
                ...options,
                energy
            })
            await new Promise((resolve, reject) => setTimeout(resolve, 5 * 1000))
        }

        let props = await dailySpeed.energyProp_list(axios, options)
        let willprops = props.filter(p => p.thaw_time == 0)
        console.info('尝试完成领燃料任务', '总数', props.length, '本次可领取', willprops.length)
        for (let prop of willprops) {
            await dailySpeed.energyProp_gain(axios, {
                ...options,
                prop
            })
        }

        let nextprops = props.filter(p => p.thaw_time > 0)
        if (nextprops.length) {
            let thaw_time = Math.min(...nextprops.map(p => p.thaw_time))
            throw new TryNextEvent(JSON.stringify({
                message: `下一次再尝试完成剩余领燃料任务 数量${nextprops.length}, 延迟${thaw_time}s`,
                relayTime: thaw_time
            }))
        }
    }
}
module.exports = dailySpeed