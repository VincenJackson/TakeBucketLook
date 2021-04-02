module.exports = async (scheduler, options, taskOption) => {

    options.cookies = taskOption.cookies

    // 京东APP-首页-领京豆-抽京豆
    await scheduler.regTask('turntable', async (request) => {
        await require('./turntable').doTask(request, options)
    }, {
        ...taskOption,
        endHours: 13
    })

    // 京东APP-首页-领京豆-进店领豆 TODO
    await scheduler.regTask('shopBean', async (request) => {
        await require('./shopBean').doTask(request, options)
    }, {
        ...taskOption,
        startTime: 0,
        ignoreRelay: true
    })

    // 京东APP-首页-领京豆-升级赚京豆
    await scheduler.regTask('findBean', async (request) => {
        await require('./findBean').doTask(request, options)
    }, {
        ...taskOption,
        startTime: 0,
        ignoreRelay: true
    })
}