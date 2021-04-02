module.exports = async (scheduler, options, taskOption) => {

    options.cookies = taskOption.cookies

    // 城城分现金
    await scheduler.regTask('city_receiveCash', async (request) => {
        await require('./city_receiveCash').doTask(request, options)
    }, taskOption)

    // 领现金-签到
    await scheduler.regTask('cash_sign', async (request) => {
        await require('./cash_sign').doSign(request, options)
    }, {
        ...taskOption,
        startTime: 10 * 3600
    })

    // 领现金-日常任务
    await scheduler.regTask('cash_tasks', async (request) => {
        await require('./cash_sign').doTask(request, options)
    }, {
        ...taskOption,
        startTime: 10.5 * 3600
    })

    // 领现金-兑换检查
    await scheduler.regTask('cash_exchangePage', async (request) => {
        await require('./cash_sign').doExchange(request, options)
    }, {
        ...taskOption,
        isCircle: true,
        intervalTime: 2 * 3600,
        startTime: 8 * 3600,
        ignoreRelay: true
    })

}