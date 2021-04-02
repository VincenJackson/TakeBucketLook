module.exports = async (scheduler, options, taskOption) => {

    options.cookies = taskOption.cookies

    // 日常任务
    await scheduler.regTask('dream_factory_tasks', async (request) => {
        await require('./dream_factory').doTask(request, options)
    }, {
        ...taskOption,
        ignoreRelay: true
    }, [{
        startTime: 7 * 3600
    }, {
        startTime: 13 * 3600
    },
    {
        startTime: 19 * 3600,
    },
    {
        startTime: 22 * 3600,
    }])

    // 自动领取电力
    await scheduler.regTask('dream_factory_collectElectricity', async (request) => {
        await require('./dream_factory').doCollectElectricityTask(request, options)
    }, {
        ...taskOption,
        isCircle: true,
        intervalTime: 9 * 60,
        startTime: 5 * 3600,
        ignoreRelay: true
    })

    // 兑换检查并通知
    await scheduler.regTask('dream_factory_checkCompleteNotify', async (request) => {
        await require('./dream_factory').doCheckCompleteNotify(request, options)
    }, {
        ...taskOption,
        isCircle: true,
        intervalTime: 2 * 3600,
        startTime: 0,
        ignoreRelay: true
    })

}