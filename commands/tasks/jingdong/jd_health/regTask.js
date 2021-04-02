module.exports = async (scheduler, options, taskOption) => {

    options.cookies = taskOption.cookies

    // 京东健康-集好眠卡 日常任务
    await scheduler.regTask('jd_health_tasks', async (request) => {
        await require('./jd_health').doTask(request, options)
    }, taskOption)
}