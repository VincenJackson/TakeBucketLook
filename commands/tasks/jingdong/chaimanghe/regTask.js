module.exports = async (scheduler, options, taskOption) => {
    // 每日签到
    await scheduler.regTask('chaimangheSgin', async (request) => {
        await require('./chaimanghe').signin(request, options)
    }, taskOption)

    // 日常任务
    await scheduler.regTask('chaimangheTask', async (request) => {
        await require('./chaimanghe').doTask(request, options)
    }, taskOption)
}