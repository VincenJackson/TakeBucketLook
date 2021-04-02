module.exports = async (scheduler, options, taskOption) => {

    options.cookies = taskOption.cookies

    // 京东直播 签到
    await scheduler.regTask('liveSign', async (request) => {
        await require('./live').doSign(request, options)
    }, taskOption)

    // 京东直播 日常任务
    await scheduler.regTask('liveTasks', async (request) => {
        await require('./live').doTask(request, options)
    }, taskOption)

}