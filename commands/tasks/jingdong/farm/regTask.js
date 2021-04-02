module.exports = async (scheduler, options, taskOption) => {

    options.cookies = taskOption.cookies

    // 东东农场 签到
    await scheduler.regTask('clockInForFarm', async (request) => {
        await require('./farm').initForFarm(request, options)
        await require('./farm').clockInForFarm(request, options)
    }, {
        ...taskOption,
        startTime: 6 * 3600,
        ignoreRelay: true
    })

    // 东东农场 首次浇水
    await scheduler.regTask('firstWaterTask', async (request) => {
        await require('./farm').firstWaterTask(request, options)
    }, {
        ...taskOption,
        startTime: 8 * 3600,
        ignoreRelay: true
    })

    // 东东农场 日常浇水
    await scheduler.regTask('doWaterForFarm', async (request) => {
        await require('./farm').doWater(request, options)
    }, {
        ...taskOption,
        ignoreRelay: true
    })

    // 东东农场 采雨滴
    await scheduler.regTask('waterRainForFarm', async (request) => {
        await require('./farm').waterRainForFarm(request, options)
    }, {
        ...taskOption,
        ignoreRelay: true
    }, [{
        startTime: 8 * 3600
    },
    {
        startTime: 12 * 3600
    }])

    // 东东农场 日常浇水
    await scheduler.regTask('farmCompleteTask', async (request) => {
        await require('./farm').completeTask(request, options)
    }, {
        ...taskOption,
        ignoreRelay: true
    })

    // 东东农场 天天红包
    await scheduler.regTask('farmLotteryForTurntable', async (request) => {
        let flag = await require('./farm').initForTurntableFarm(request, options)
        if (flag) {
            await require('./farm').lotteryForTurntableFarm(request, options)
        }
    }, {
        ...taskOption,
        isCircle: true,
        intervalTime: 4 * 3600,
        startTime: 7 * 3600,
        ignoreRelay: true
    })

    // 东东农场 定时浇水
    await scheduler.regTask('farmThreeMeals', async (request) => {
        await require('./farm').gotThreeMealForFarm(request, options)
    }, {
        ...taskOption,
        ignoreRelay: true
    }, [{
        startTime: 7 * 3600
    },
    {
        startTime: 12 * 3600
    },
    {
        startTime: 18 * 3600,
    }])

    // 东东农场 我的助力码
    // --tryrun --tasks farmsharcode
    await scheduler.regTask('farmsharcode', async (request) => {
        await require('./farm').farmsharcode(request, options)
    }, {
        ...taskOption,
        ignore: true
    })

}