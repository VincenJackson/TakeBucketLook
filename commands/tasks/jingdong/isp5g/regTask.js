module.exports = async (scheduler, options, taskOption) => {

    options.cookies = taskOption.cookies

    // 开启游戏及抽奖
    await scheduler.regTask('isp5gStartGame', async (request) => {
        await require('./isp5g').startGame(request, options)
    }, {
        ...taskOption,
        startTime: 0
    })

    // 定时收取信号值
    await scheduler.regTask('isp5gGetCoins', async (request) => {
        await require('./isp5g').getCoin(request, options)
    }, {
        ...taskOption,
        isCircle: true,
        intervalTime: 3 * 3600,
        startTime: 0,
        ignoreRelay: true
    })

    // 日常任务
    await scheduler.regTask('isp5gTasks', async (request) => {
        await require('./isp5g').doTasks(request, options)
    }, {
        ...taskOption,
        startTime: 0
    })
}