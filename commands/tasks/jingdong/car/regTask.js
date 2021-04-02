module.exports = async (scheduler, options, taskOption) => {

    options.cookies = taskOption.cookies

    // 京东汽车 车主福利签到
    await scheduler.regTask('carSign', async (request) => {
        await require('./car').doSign(request, options)
    }, taskOption)

    // 京东汽车 车主福利日常任务
    await scheduler.regTask('carTasks', async (request) => {
        await require('./car').doTasks(request, options)
    }, taskOption)

}