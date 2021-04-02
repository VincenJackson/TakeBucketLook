module.exports = async (scheduler, options, taskOption) => {

    options.cookies = taskOption.cookies

    // 宠汪汪-玩游戏
    await scheduler.regTask('petCompleteGameTask', async (request) => {
        await require('./jdjoy').completeGameTask(request, options)
    }, {
        ...taskOption,
        ignoreRelay: true
    }, [{
        startTime: 10 * 3600
    },
    {
        startTime: 20 * 3600,
    }])

    // 宠汪汪-玩游戏-帮朋友喂养
    // 容易出现拼图验证
    // await scheduler.regTask('HelpFeed', async (request) => {
    //     await require('./jdjoy').HelpFeed(request, options)
    // }, {
    //     ...taskOption,
    //     isCircle: true,
    //     intervalTime: 3.5 * 3600,
    //     startTime: 6 * 3600,
    //     ignoreRelay: true
    // })

    // 宠汪汪-玩游戏-每日签到
    await scheduler.regTask('petUserSign', async (request) => {
        await require('./jdjoy').UserSign(request, options)
    }, taskOption)

    // 宠汪汪-玩游戏-每日喂食
    await scheduler.regTask('petFeedEveryDay', async (request) => {
        await require('./jdjoy').FeedEveryDay(request, options)
    }, {
        ...taskOption,
        isCircle: true,
        intervalTime: 3 * 3600,
        startTime: 6 * 3600,
        ignoreRelay: true
    })

    // 宠汪汪-玩游戏-积分兑换京豆(限时抢兑) 16:00 0:00 8:00
    await scheduler.regTask('petExchangeJdBean', async (request) => {
        await require('./jdjoy').exchangeJdBean(request, options)
    }, {
        ...taskOption,
        ignoreRelay: true
    }, [{
        startTime: 0
    },
    {
        startTime: 8 * 3600
    },
    {
        startTime: 16 * 3600,
    }])

    // 宠汪汪-玩游戏-每日三餐
    await scheduler.regTask('petThreeMeals', async (request) => {
        await require('./jdjoy').ThreeMeals(request, options)
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
        startTime: 17 * 3600,
    }])

    // 宠汪汪 我的助力码
    // --tryrun --tasks petSharcode
    await scheduler.regTask('petSharcode', async (request) => {
        await require('./jdjoy').sharcode(request, options)
    }, {
        ...taskOption,
        ignore: true
    })

}