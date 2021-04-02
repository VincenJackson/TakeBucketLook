module.exports = async (scheduler, options, taskOption) => {

    // 每日特价-天天砸金蛋
    await scheduler.regTask('zajindanTasks', async (request) => {
        await require('./zajindan').doTask(request, options)
    }, taskOption)

}