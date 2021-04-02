module.exports = async (scheduler, options, taskOption) => {

    options.cookies = taskOption.cookies

    // 京东金贴 签到
    await scheduler.regTask('JinTieSign', async (request) => {
        await require('./JinTie').doSign(request, options)
    }, {
        ...taskOption,
        startTime: 8 * 3600
    })


    // 京东金贴 日常任务
    await scheduler.regTask('JinTieCompleteTasks', async (request) => {
        await require('./JinTie').completeTasks(request, options)
    }, {
        ...taskOption,
        startHours: 7,
        ignoreRelay: true
    })

}