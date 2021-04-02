module.exports = async (scheduler, options, taskOption) => {

    options.cookies = taskOption.cookies

    await scheduler.regTask('seckillTasks', async (request) => {
        await require('./seckill').doTask(request, options)
    }, {
        ...taskOption,
        startHours: 7
    })

}