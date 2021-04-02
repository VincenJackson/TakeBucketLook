module.exports = async (scheduler, options, taskOption) => {

    options.cookies = taskOption.cookies

    // 日常签到
    await scheduler.regTask('jdsupermarketSign', async (request) => {
        await require('./jdsupermarket').smtg_sign(request, {
            ...options,
            channel: 1
        })
    }, taskOption)

    // 每日蓝币-京豆兑换
    await scheduler.regTask('jdsupermarketBean', async (request) => {
        await require('./jdsupermarket').doobtainPrize(request, options)
    }, {
        ...taskOption,
        startTime: 8 * 3600,
        ignoreRelay: true
    })

    // 日常任务
    await scheduler.regTask('jdsupermarketTasks', async (request) => {
        await require('./jdsupermarket').doTask(request, options)
    }, taskOption)

    // 自动收取营业额
    await scheduler.regTask('jdsupermarketReceiveCoin', async (request) => {
        await require('./jdsupermarket').smtg_receiveCoin(request, {
            ...options,
            body: { "type": 4, "channel": "1" }
        })
    }, {
        ...taskOption,
        isCircle: true,
        intervalTime: 11 * 3600,
        startTime: 5 * 3600,
        ignoreRelay: true
    })

}