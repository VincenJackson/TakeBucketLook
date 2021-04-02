
const { TryNextEvent } = require('../../../../utils/EnumError')
const { reqApiNoSign } = require('../api/client')
const moment = require('moment');
const path = require('path')
const fs = require('fs-extra')

// 种豆得豆
// https://bean.m.jd.com/plantBean/index.action
var plantBean = {
    plantBeanIndex: async (axios, options) => {
        let { data } = await reqApiNoSign(axios, {
            ...options,
            functionId: 'plantBeanIndex',
            body: {
                "monitor_refer": "plant_app_plant_index",
                "monitor_source": "plant_app_plant_index",
                "version": "9.2.4.0"
            }
        })
        let round = data.roundList.find(r => r.roundState === '2')
        console.info('本轮活动', round.roundId, round.dateDesc)
        let preround = data.roundList.find(r => r.roundState === '1')
        console.info('上期活动', preround.roundId, preround.dateDesc)
        return {
            roundId: round.roundId,
            preroundId: preround.roundId,
            taskList: data.taskList
        }
    },
    receivedBean: async (axios, options) => {
        if (moment().isoWeekday() !== 1) {
            console.error('今日不是周一')
            return
        }
        let { preroundId } = await plantBean.plantBeanIndex(axios, options)
        let data = await reqApiNoSign(axios, {
            ...options,
            functionId: 'receivedBean',
            body: {
                "monitor_refer": "receivedBean",
                "monitor_source": "plant_app_plant_index",
                "roundId": preroundId,
                "version": "9.2.4.0"
            }
        })
        if (!data.errorCode) {
            if (data.data.awardBean) {
                console.info('上期豆豆成长值为', data.data.growth, '本次瓜分到京豆', data.data.awardBean)
                console.reward('京豆', data.data.awardBean)
            }
        } else {
            console.error(data.errorMessage)
        }
    },
    receiveNutrients: async (axios, options) => {
        let { roundId } = await plantBean.plantBeanIndex(axios, options)
        let data = await reqApiNoSign(axios, {
            ...options,
            functionId: 'receiveNutrients',
            body: {
                "monitor_refer": "plant_receiveNutrients",
                "monitor_source": "plant_app_plant_index",
                "roundId": roundId,
                "version": "9.2.4.0"
            }
        })
        if (data.code === '0') {
            if (!data.errorCode) {
                console.info('周期任务-领取营养液成功', data.data.nutrients, '下一次领取时间', data.data.nextReceiveTime, '累积成长值', data.data.cultureBeanRes.growth)
                throw new TryNextEvent(JSON.stringify({
                    message: '在下一轮尝试一次'
                }))
            } else {
                console.error('周期任务领取营养液失败', data.errorMessage)
            }
        } else {
            console.error('周期任务领取营养液失败')
        }
    },
    cultureBean: async (axios, options) => {
        const { nutrientsType, monitor_refer } = options
        let roundId = options.roundId
        if (!roundId) {
            let res = await plantBean.plantBeanIndex(axios, options)
            roundId = res.roundId
        }
        let data = await reqApiNoSign(axios, {
            ...options,
            functionId: 'cultureBean',
            body: {
                "roundId": roundId,
                "nutrientsType": nutrientsType + '',
                "monitor_source": "plant_m_plant_index",
                "monitor_refer": monitor_refer || "plant_index",
                "version": "9.2.4.0"
            },
            method: 'get',
            headers: {
                referer: 'https://bean.m.jd.com/'
            }
        })
        if (data.code === '0') {
            if (!data.errorCode) {
                console.info('喂养成功', '累积成长值', data.data.growth)
            } else {
                console.error('喂养失败', data.errorMessage)
            }
        } else {
            console.error('喂养失败', data)
        }
    },
    completeTasks: async (axios, options) => {
        let { taskList, roundId } = await plantBean.plantBeanIndex(axios, options)
        let taskStatus_tasks = taskList.filter(t => t.isFinished === 0)
        // 7 金融双签  https://m1.jr.jd.com/integrate/signin/index.html?source=zddd
        console.info('剩余未完成任务数', taskStatus_tasks.length)
        for (let task of taskStatus_tasks) {
            console.info(task.taskType, task.taskName)
            let type = ''
            if ([2, 25, 30, 36, 35, 38, 44, 53, 54, 18, 4, 7].indexOf(task.taskType) !== -1) {
                type = 0
            } else {
                type = task.taskType
            }
            if (fs.existsSync(path.join(__dirname, './taskType' + type + '.js'))) {
                let success = await require('./taskType' + type).doTask(axios, {
                    ...options,
                    task
                })
                await new Promise((resolve, reject) => setTimeout(resolve, 3 * 1000))
                if (success) {
                    await plantBean.cultureBean(axios, {
                        ...options,
                        roundId,
                        nutrientsType: task.taskType,
                        monitor_refer: "plant_receiveNutrients"
                    })
                }
            } else {
                console.error('未实现的任务', task.taskName, task.taskType)
            }
        }
    },
}

module.exports = plantBean