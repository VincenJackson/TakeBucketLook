
const { buildparams } = require('./common')
const { w } = require('../sign/common')

var transParams = (data) => {
    let params = new URLSearchParams();
    for (let item in data) {
        params.append(item, data['' + item + '']);
    }
    return params;
};

// 疯狂的JOY签到
var crazy_joy = {
    openBox: async (axios, options) => {
        let box = await crazy_joy.jsonpDispatchBox(axios, options)
        if (box.data) {
            await crazy_joy.jsonpOpenBox(axios, options)
        } else {
            console.error('获取宝箱失败', box)
        }
    },
    jsonpDispatchBox: async (axios, options) => {
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": "https://an.jd.com",
                "referer": `https://an.jd.com/babelDiy/Zeus/3wfUwA7mTNiv7nQg1HGGyE7gCPqZ/index.html`,
            },
            url: `https://api.m.jd.com?` + w({
                'appid': 'joy-friend',
                jsonp: 'jsonpDispatchBox',
                name: 'jsonpDispatchBox',
                functionId: 'dispatchBox',
                body: JSON.stringify({ "type": "8", "clientType": "jdApp" }),
                callback: 'jsonpDispatchBox',
                _: Date.now()
            }),
            method: 'get'
        })
        return JSON.parse(data.substr(17).slice(0, -2))
    },
    jsonpOpenBox: async (axios, options) => {
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": "https://an.jd.com",
                "referer": `https://an.jd.com/babelDiy/Zeus/3wfUwA7mTNiv7nQg1HGGyE7gCPqZ/index.html`,
            },
            url: `https://api.m.jd.com?` + w({
                'appid': 'joy-friend',
                jsonp: 'jsonpOpenBox',
                name: 'jsonpOpenBox',
                functionId: 'dispatchBox',
                body: JSON.stringify({ "type": "8", "clientType": "jdApp" }),
                callback: 'jsonpOpenBox',
                _: Date.now()
            }),
            method: 'get'
        })
        let result = JSON.parse(data.substr(13).slice(0, -2))
        if (result.code === '0') {
            if (result?.data?.bean) {
                console.reward('京豆', result?.data?.bean)
            }
            if (result?.data?.card) {
                console.info('获得卡片数', result?.data?.card.length)
            }
        } else {
            console.error('宝箱开启失败', result)
        }
    },
    getTaskState: async (axios, options) => {
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": "https://crazy-joy.jd.com",
                "referer": `https://crazy-joy.jd.com/?sid=4c2924001394eb72765bf94e006c2e8w`,
            },
            url: `https://api.m.jd.com`,
            method: 'post',
            data: transParams(buildparams({ "paramData": { "taskType": "DAY_TASK" } }, 'crazy_joy', 'crazyJoy_task_getTaskState'))
        })
        if (data.success) {
            console.info('获取每日任务成功')
            return data.data
        } else {
            console.error('获取每日任务失败', data.resultTips)
        }
    },
    viewPageStart: async (axios, options) => {
        const { task } = options
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": "https://crazy-joy.jd.com",
                "referer": `https://crazy-joy.jd.com/?sid=4c2924001394eb72765bf94e006c2e8w`,
            },
            url: `https://api.m.jd.com`,
            method: 'post',
            data: transParams(buildparams({ "action": "MARK", "taskId": task.taskId }, 'crazy_joy', 'crazyJoy_task_viewPage'))
        })
        if (data.success) {
            console.info(`领取浏览任务[${data.data.taskTitle}]成功`)
            return data.data.taskRecordId
        } else {
            console.error(`领取浏览任务[${data.data.taskTitle}]失败`, data.resultTips)
        }
    },
    viewPageEnd: async (axios, options) => {
        const { task, taskRecordId } = options
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": "https://crazy-joy.jd.com",
                "referer": `https://crazy-joy.jd.com/?sid=4c2924001394eb72765bf94e006c2e8w`,
            },
            url: `https://api.m.jd.com`,
            method: 'post',
            data: transParams(
                buildparams({ "action": "INCREASE", "taskId": task.taskId, "taskRecordId": taskRecordId }, 'crazy_joy', 'crazyJoy_task_viewPage')
            )
        })
        if (data.success) {
            console.info('完成浏览任务成功', '可获得游戏金币', task.coins)
        } else {
            console.error('完成浏览任务失败', data.resultTips)
        }
    },
    taskObtainAward: async (axios, options) => {
        const { task, taskRecordId } = options
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": "https://crazy-joy.jd.com",
                "referer": `https://crazy-joy.jd.com/?sid=4c2924001394eb72765bf94e006c2e8w`,
            },
            url: `https://api.m.jd.com`,
            method: 'post',
            data: transParams(
                buildparams({ "taskId": task.taskId }, 'crazy_joy', 'crazyJoy_task_obtainAward')
            )
        })
        if (data.success) {
            console.info('领取游戏金币成功', data.data.coins)
        } else {
            console.error('领取游戏金币失败', data.resultTips)
        }
    },
    eventObtainAward: async (axios, options) => {
        const { body } = options
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": "https://crazy-joy.jd.com",
                "referer": `https://crazy-joy.jd.com/?sid=4c2924001394eb72765bf94e006c2e8w`,
            },
            url: `https://api.m.jd.com`,
            method: 'post',
            data: transParams(
                buildparams(body, 'crazy_joy', 'crazyJoy_event_obtainAward')
            )
        })
        return data
    },
    gameState: async (axios, options) => {
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": "https://crazy-joy.jd.com",
                "referer": `https://crazy-joy.jd.com/?sid=4c2924001394eb72765bf94e006c2e8w`,
            },
            url: `https://api.m.jd.com`,
            method: 'post',
            data: transParams(
                buildparams({ "paramData": { "inviter": "" } }, 'crazy_joy', 'crazyJoy_user_gameState')
            )
        })
        if (data.success) {
            console.log('获取游戏状态成功')
            return data.data
        } else {
            console.error('获取游戏状态失败', data.resultTips)
            return false
        }
    },
    gameConfig: async (axios, options) => {
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": "https://crazy-joy.jd.com",
                "referer": `https://crazy-joy.jd.com/?sid=4c2924001394eb72765bf94e006c2e8w`,
            },
            url: `https://api.m.jd.com`,
            method: 'post',
            data: transParams(
                buildparams(undefined, 'crazy_joy', 'crazyJoy_event_gameConfig')
            )
        })
        if (data.success) {
            console.info('获取游戏配置成功')
            return data.data.joyConfigs || []
        } else {
            console.error('获取游戏配置失败', data.resultTips)
            return []
        }
    },
    allowBoughtList: async (axios, options) => {
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": "https://crazy-joy.jd.com",
                "referer": `https://crazy-joy.jd.com/?sid=4c2924001394eb72765bf94e006c2e8w`,
            },
            url: `https://api.m.jd.com`,
            method: 'post',
            data: transParams(
                buildparams({ "paramData": { "entry": "SHOP" } }, 'crazy_joy', 'crazyJoy_joy_allowBoughtList')
            )
        })
        if (data.success) {
            console.log('获取可用Joy成功')
            return data.data.shop
        } else {
            console.error('获取可用Joy失败', data.resultTips)
            return []
        }
    },
    buyJoy: async (axios, options) => {
        const { joys, totalCoinAmount, minlevel, maxlevel } = options
        let wjoy = joys.filter(j => j.buyCoin > 0 && j.buyCoin < totalCoinAmount && j.level > 0 && j.level >= minlevel && j.level <= maxlevel)
        let joy = wjoy[Math.floor(Math.random() * wjoy.length)]

        if (!joy) {
            wjoy = joys.filter(j => j.buyCoin > 0 && j.buyCoin < totalCoinAmount && j.level > 0)
            joy = wjoy[Math.floor(Math.random() * wjoy.length)]
        }

        if (!joy) {
            console.log('没有获取到joy,跳过购买')
            return false
        }
        console.log('将购买', `name:${joy.name} id:${joy.id} level:${joy.level}`)
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": "https://crazy-joy.jd.com",
                "referer": `https://crazy-joy.jd.com/?sid=4c2924001394eb72765bf94e006c2e8w`,
            },
            url: `https://api.m.jd.com`,
            method: 'post',
            data: transParams(
                buildparams({ "action": "BUY", "joyId": joy.id, "boxId": "" }, 'crazy_joy', 'crazyJoy_joy_trade')
            )
        })
        if (data.success) {
            if (data.data.lackCoin) {
                console.error('购买失败', '金币不足')
                return false
            }
            console.log('购买成功', '本次花费', data.data.coins, '下次花费', data.data.nextBuyPrice, '剩余金币', data.data.totalCoins)
            return {
                flag: parseInt(data.data.totalCoins) >= data.data.nextBuyPrice,
                totalCoins: data.data.totalCoins
            }


        } else {
            console.error('购买失败', data.resultTips)
            return {
                flag: false,
                totalCoins: totalCoinAmount
            }
        }
    },
    produce: async (axios, options) => {
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": "https://crazy-joy.jd.com",
                "referer": `https://crazy-joy.jd.com/?sid=4c2924001394eb72765bf94e006c2e8w`,
            },
            url: `https://api.m.jd.com`,
            method: 'post',
            data: transParams(
                buildparams(undefined, 'crazy_joy', 'crazyJoy_joy_produce')
            )
        })
        if (data.success) {
            console.log('定时收益成功', data.data.coins)
        } else {
            console.error('定时收益失败', data.resultTips)
        }
    },
    mergeJoy: async (axios, options) => {
        const { fromBoxIndex, targetBoxIndex, newlevel } = options
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": "https://crazy-joy.jd.com",
                "referer": `https://crazy-joy.jd.com/?sid=4c2924001394eb72765bf94e006c2e8w`,
            },
            url: `https://api.m.jd.com`,
            method: 'post',
            data: transParams(
                buildparams({ "operateType": "MERGE", "fromBoxIndex": fromBoxIndex, "targetBoxIndex": targetBoxIndex }, 'crazy_joy', 'crazyJoy_joy_moveOrMerge')
            )
        })
        if (data.success) {
            console.log('合成成功')
            if ([/*12,*/ 18, 22, 34].indexOf(newlevel) !== -1) {
                console.log('GROWTH_REWARD', data)
                // await require('./crazy_joy').eventObtainAward(request, {
                //     ...options,
                //     body: { "eventType": "GROWTH_REWARD", "eventRecordId": "579634925250756608" }
                // })
            }
            return true
        } else {
            console.error('合成失败', data.resultTips)
            return false
        }
    },
    sellJoy: async (axios, options) => {
        const { boxed } = options
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": "https://crazy-joy.jd.com",
                "referer": `https://crazy-joy.jd.com/?sid=4c2924001394eb72765bf94e006c2e8w`,
            },
            url: `https://api.m.jd.com`,
            method: 'post',
            data: transParams(
                buildparams({ "action": "SELL", "joyId": boxed.id, "boxId": boxed.boxId }, 'crazy_joy', 'crazyJoy_joy_trade')
            )
        })
        if (data.success) {
            console.log('售出成功', `id:${boxed.id} level:${boxed.level} box: ${boxed.boxId}`)
            return true
        } else {
            console.error('售出失败', data.resultTips)
            return false
        }
    },
    doSignTask: async (axios, options) => {
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": "https://crazy-joy.jd.com",
                "referer": `https://crazy-joy.jd.com/?sid=4c2924001394eb72765bf94e006c2e8w`,
            },
            url: `https://api.m.jd.com`,
            method: 'post',
            data: transParams(
                buildparams(undefined, 'crazy_joy', 'crazyJoy_task_doSign')
            )
        })
        if (data.success) {
            if (data.resultCode === '0') {
                console.info('疯狂的JOY签到成功')
                if (data.data.beans) {
                    console.info('签到奖励 京豆', data.data.beans)
                    console.reward('京豆', data.data.beans)
                }
            } else {
                console.error('疯狂的JOY签到失败', data)
            }
        } else {
            console.error('疯狂的JOY签到失败', data.resultTips)
        }
    },
    doDailyTask: async (axios, options) => {
        let tasks = await crazy_joy.getTaskState(axios, options)
        tasks = tasks.filter(t => t.status === 0)
        console.info('未完成任务数', tasks.length)
        for (let task of tasks) {
            // 浏览任务
            if (task.taskTypeId === 103) {
                let taskRecordId = await crazy_joy.viewPageStart(axios, {
                    ...options,
                    task
                })
                if (taskRecordId) {
                    await new Promise((resolve, reject) => setTimeout(resolve, 10 * 1000))
                    await crazy_joy.viewPageEnd(axios, {
                        ...options,
                        task,
                        taskRecordId
                    })
                    await crazy_joy.taskObtainAward(axios, {
                        ...options,
                        task
                    })
                }
            } else {
                // 102 邀请好友每天助力
                console.error('还未处理', task.taskTitle, task.taskTypeId)
            }
        }
    },
    playGame: async (axios, options) => {
        let s = Math.floor((new Date).getTime() / 1000)
        let produceInterval
        try {
            produceInterval = setInterval(() => {
                crazy_joy.produce(axios, options)
            }, 5 * 1000)

            let joyconfigs = await crazy_joy.gameConfig(axios, options)
            let jjoy = await crazy_joy.allowBoughtList(axios, options)
            if (!jjoy) {
                console.error('获取Joy信息失败，跳过执行')
                return
            }

            do {
                let res = await crazy_joy.gameState(axios, options)
                if (!res) {
                    console.log('等待20s')
                    await new Promise((resolve, reject) => setTimeout(resolve, 20 * 1000))
                    continue
                }
                let vaa = res.joyIds
                let va = vaa.filter(j => j > 0)
                let vas = joyconfigs.filter(j => va.includes(j.id) && j.level > 0).map(j => j.level)
                let minlevel = Math.min(...vas)
                let maxBuyLevel = joyconfigs.find(j => j.id === (jjoy || []).filter(j => j.status === 1).pop().joyId).level
                let maxlevel = Math.max(...[...vas, maxBuyLevel])
                console.log('已有JOY数量', va.length, '最高等级', maxlevel, '最低等级', minlevel, '最大可购买等级', maxBuyLevel)
                if (va.length < 12) {
                    let n = 12 - va.length
                    console.log('位置未满，尝试购买', n, '只')
                    let flag = false
                    let totalCoins = res.totalCoinAmount
                    do {
                        let { flag: nflag, totalCoins: ntotalCoins } = await crazy_joy.buyJoy(axios, {
                            ...options,
                            minlevel,
                            maxlevel: maxBuyLevel,
                            totalCoinAmount: Math.min(totalCoins, res.totalCoinAmount),
                            joys: joyconfigs.filter(j =>
                                jjoy.map(jjc => jjc.joyId).includes(j.id)
                                && (
                                    // 不足2时，限制购买已存在的level，凑成一对
                                    (n <= 1 && vas.includes(j.level))
                                    // 大于1不做限制
                                    || n > 1
                                )
                            ).map(jc => {
                                let jcc = jjoy.find(j => j.joyId === jc.id)
                                return {
                                    ...jc,
                                    buyCoin: jcc.coins
                                }
                            })
                        })
                        flag = nflag
                        totalCoins = ntotalCoins
                        await new Promise((resolve, reject) => setTimeout(resolve, 5 * 1000))
                        n -= 1
                    } while (flag && n > 0)

                    // 取得更新状态
                    await new Promise((resolve, reject) => setTimeout(resolve, 15 * 1000))
                    res = await crazy_joy.gameState(axios, options)
                    if (res.joyIds) {
                        va = res.joyIds.filter(j => j > 0)
                    } else {
                        break
                    }
                    await new Promise((resolve, reject) => setTimeout(resolve, 10 * 1000))
                } else {
                    console.log('位置已满，跳过购买')
                }

                // 自动合成
                let hash = {}
                vaa.map(v => {
                    if (v > 0) {
                        if (!((v + '') in hash)) {
                            hash[v + ''] = 1
                        } else {
                            hash[v + ''] += 1
                        }
                    }
                })
                console.log('等级状态', hash)

                let kk = 0
                for (let v in hash) {
                    if (v > 0 && hash[v + ''] > 0) {
                        kk += 1
                    }
                }
                if (kk === 12) {
                    console.log('无法合成, 尝试售出Joy')
                    let kbs = joyconfigs.filter(j => res.joyIds.includes(j.id) && j.level > 0)
                    let aas = res.joyIds.map((kj, index) => {
                        let kb = kbs.find(k => k.id === kj)
                        return {
                            ...kb,
                            boxId: index
                        }
                    }).filter(t => t.id)
                    let minlevel = Math.min(...aas.map(t => t.level))
                    let boxed = aas.find(t => t.level === minlevel)
                    await crazy_joy.sellJoy(axios, {
                        ...options,
                        boxed
                    })

                    console.log('等待5s')
                    await new Promise((resolve, reject) => setTimeout(resolve, 5 * 1000))

                    continue
                }

                for (let v in hash) {
                    if (v > 0 && hash[v] >= 2) {
                        console.log(v)
                        do {
                            let targetBoxIndex = vaa.findIndex(t => (t + '') === v)
                            if (targetBoxIndex === -1) {
                                break
                            }
                            console.log('find', v, targetBoxIndex)
                            let vva = [...vaa]
                            vva.splice(0, targetBoxIndex + 1)
                            let fff = vva.findIndex(t => (t + '') === v)
                            if (fff === -1) {
                                break
                            }
                            let fromBoxIndex = fff + targetBoxIndex + 1
                            console.log('find', v, fromBoxIndex)
                            console.log(vaa, vaa[fromBoxIndex], vaa[targetBoxIndex])
                            if (vaa[fromBoxIndex] === vaa[targetBoxIndex]) {
                                console.log(`${fromBoxIndex}[${vaa[fromBoxIndex]}] + ${targetBoxIndex}[${vaa[targetBoxIndex]}] => ${targetBoxIndex}[${vaa[targetBoxIndex] + 1}]`)
                                await crazy_joy.mergeJoy(axios, {
                                    ...options,
                                    fromBoxIndex,
                                    targetBoxIndex,
                                    newlevel: vaa[targetBoxIndex] + 1
                                })
                                vaa[targetBoxIndex] = vaa[targetBoxIndex] + 1
                                vaa[fromBoxIndex] = 0

                                if (!((vaa[targetBoxIndex] + '') in hash)) {
                                    hash[vaa[targetBoxIndex] + ''] = 1
                                } else {
                                    hash[vaa[targetBoxIndex] + ''] += 1
                                }

                                if (!((vaa[fromBoxIndex] + '') in hash)) {
                                    hash[vaa[fromBoxIndex] + ''] = 0
                                } else {
                                    hash[vaa[fromBoxIndex] + ''] -= 1
                                }

                                console.log('等待5s')
                                await new Promise((resolve, reject) => setTimeout(resolve, 5 * 1000))
                            } else {
                                console.error('计算出错，跳过合并')
                            }
                        } while (true)
                    }
                }

                jjoy = await crazy_joy.allowBoughtList(axios, options)
                let e = Math.floor((new Date).getTime() / 1000)
                // 每轮最多持续
                if ((e - 1 * 3660 - 30) > s) {
                    console.info('已执行了1 hours，休息一下')
                    break
                }

            } while (true)

        } catch (err) {
            throw new Error(err)
        } finally {
            if (produceInterval) {
                clearInterval(produceInterval)
            }
        }

    }
}
module.exports = crazy_joy