
const { reqApiSign } = require('../api/client')
const path = require('path')
const fs = require('fs-extra')
// 东东萌宠
var petTown = {
    initPetTown: async (axios, options) => {
        let data = await reqApiSign(axios, {
            ...options,
            functionId: 'initPetTown',
            body: { "version": 1 }
        })
        if (data.code === '0') {
            console.info('登录东东萌宠成功')
            let result = data.result
            if (result.petStatus === 1) {
                console.error('你尚未领养宠物，请在手机端领养后再使用')
                return {
                    flag: false
                }
            } else {
                console.info('当前宠物为:', result.petInfo.nickName, '目标商品为:', result.goodsInfo.goodsName, '剩余狗粮:', result.foodAmount, '勋章数量:', result.medalNum, '勋章进度:', result.medalPercent + '%')
                return {
                    petPlaceInfoList: result.petPlaceInfoList,
                    flag: true
                }
            }
        } else {
            console.error('登录东东萌宠失败', data)
            return {
                flag: false
            }
        }
    },
    taskInit: async (axios, options) => {
        let data = await reqApiSign(axios, {
            ...options,
            functionId: 'taskInit',
            body: { "channel": "app", "version": 2 }
        })
        return data.result
    },
    feedPets: async (axios, options) => {
        let data = await reqApiSign(axios, {
            ...options,
            functionId: 'feedPets',
            body: { "version": 1 }
        })
        if (data.resultCode !== '0') {
            return false
        }
        let reult = data.result || {}
        if (reult.petSportStatus === 1) {
            console.info('运动激励')
            await require('./petSport').doTask(axios, {
                ...options,
                petTown
            })
        }
        if (reult.energyReward > 0) {
            console.info('好感度激励')
            for (let placeI of reult.petPlaceInfoList) {
                if (placeI.energy) {
                    console.info('预计可搜集好感度', placeI.energy)
                    await petTown.energyCollect(axios, {
                        ...options,
                        place: placeI.place
                    })
                    await new Promise((resolve, reject) => setTimeout(resolve, 3 * 1000))
                }
            }
        }
        return reult
    },
    sharcode: async (axios, options) => {
        let data = await reqApiSign(axios, {
            ...options,
            functionId: 'initPetTown',
            body: { "version": 1 }
        })
        if (data.code === '0') {
            console.log('我的东东萌宠助力码', data.result.shareCode)
        } else {
            console.error('获取助力码失败', data)
        }
    },
    energyCollect: async (axios, options) => {
        const { place } = options
        let data = await reqApiSign(axios, {
            ...options,
            functionId: 'energyCollect',
            body: { place }
        })
        if (data.code === '0') {
            console.info('好感度收集成功', '总计', data.result.totalEnergy, '还需', data.result.needCollectEnergy, '勋章数量:', data.result.medalNum, '勋章进度:', data.result.medalPercent + '%')
        } else {
            console.error('好感度收集失败', data)
        }
    },
    petThreeMeal: async (axios, options) => {
        let { flag } = await petTown.initPetTown(axios, options)
        if (flag) {
            let taskId = 'threeMealInit'
            let result = await petTown.taskInit(axios, options)
            if (!result[taskId].finished) {
                await require('./' + taskId).doTask(axios, {
                    ...options,
                    task: {
                        ...result[taskId],
                        taskId
                    },
                    petTown
                })
            }
        }
    },
    petTownFeedPets: async (axios, options) => {
        console.info('开始消耗剩余未使用的狗粮')
        do {
            let result = await petTown.feedPets(axios, options)
            console.log('剩余狗粮', result.foodAmount)
            if (!result || result.foodAmount <= 0) {
                break
            }
            await new Promise((resolve, reject) => setTimeout(resolve, 3 * 1000))
        } while (true)
    },
    petTownTasks: async (axios, options) => {
        let { petPlaceInfoList, flag } = await petTown.initPetTown(axios, options)
        if (flag) {
            let result = await petTown.taskInit(axios, options)
            for (let taskId of result.taskList) {
                if (taskId === 'threeMealInit') {
                    // 跳过
                    continue
                }
                if (result[taskId].finished) {
                    console.info(result[taskId].title || taskId, '已完成')
                } else {
                    if (fs.existsSync(path.join(__dirname, './' + taskId + '.js'))) {
                        await require('./' + taskId).doTask(axios, {
                            ...options,
                            task: {
                                ...result[taskId],
                                taskId
                            },
                            petTown
                        })
                    } else {
                        console.error('未实现的任务', result[taskId].title || taskId)
                    }
                }
            }
            for (let placeI of petPlaceInfoList) {
                if (placeI.energy) {
                    console.info('预计可搜集好感度', placeI.energy)
                    await petTown.energyCollect(axios, {
                        ...options,
                        place: placeI.place
                    })
                    await new Promise((resolve, reject) => setTimeout(resolve, 3 * 1000))
                }
            }

        }
    }
}
module.exports = petTown