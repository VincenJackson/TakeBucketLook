module.exports = async (scheduler, options, taskOption) => {

    // JOY总动员-集卡开宝箱
    await scheduler.regTask('crazyJoyOpenBox', async (request) => {
        await require('./crazy_joy').openBox(request, options)
    }, taskOption)

    // 疯狂的JOY-签到
    await scheduler.regTask('crazyJoySignTask', async (request) => {
        await require('./crazy_joy').doSignTask(request, options)
    }, taskOption)

    // 疯狂的JOY-日常任务
    await scheduler.regTask('crazyJoyDailyTask', async (request) => {
        await require('./crazy_joy').doDailyTask(request, options)
    }, taskOption)

    // 疯狂的JOY-金币补给
    await scheduler.regTask('crazyJoyEventObtainAward', async (request) => {
        let data = await require('./crazy_joy').eventObtainAward(request, {
            ...options,
            body: { "eventType": "HOUR_BENEFIT" }
        })
        if (data.success) {
            console.info('完成金币补给', '获得游戏金币', data.data.coins)
        } else {
            console.error('完成金币补给失败', data.resultTips)
        }
    }, {
        ...taskOption,
        isCircle: true,
        intervalTime: 0.5 * 3600,
        startTime: 8 * 3600,
        ignoreRelay: true
    })

    // 疯狂的JOY-玩游戏
    await scheduler.regTask('crazyJoyPlayGame', async (request) => {
        await require('./crazy_joy').playGame(request, options)
    }, {
        ...taskOption,
        isCircle: true,
        intervalTime: 10 * 60,
        startTime: 6 * 3600,
        ignoreRelay: true
    })

}