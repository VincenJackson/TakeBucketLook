module.exports = async (scheduler, options, taskOption) => {

    options.cookies = taskOption.cookies

    // 东东萌宠 日常任务
    await scheduler.regTask('petTownTasks', async (request) => {
        await require('./petTown').petTownTasks(request, options)
        await require('./petTown').petTownFeedPets(request, options)
    }, {
        ...taskOption,
        startHours: 8
    })

    // 东东萌宠 每日三餐
    await scheduler.regTask('petThreeMeal', async (request) => {
        await require('./petTown').petThreeMeal(request, options)
    }, {
        ...taskOption,
        ignoreRelay: true
    }, [{
        startTime: 8 * 3600
    },
    {
        startTime: 12 * 3600
    },
    {
        startTime: 18 * 3600,
    }])

    // 东东萌宠 我的助力码
    // --tryrun --tasks petTownSharcode
    await scheduler.regTask('petTownSharcode', async (request) => {
        await require('./petTown').sharcode(request, options)
    }, {
        ...taskOption,
        ignore: true
    })

}