module.exports = async (scheduler, options, taskOption) => {

    options.cookies = taskOption.cookies

    // 天天加速
    await scheduler.regTask('dailySpeedTasks', async (request) => {
        await require('./dailySpeed').doTask(request, options)
    }, {
        ...taskOption
    }, [{
        startTime: 9 * 3600
    },
    {
        startTime: 20 * 3600,
    }])

}