module.exports = async (scheduler, options, taskOption) => {
    // 日常任务
    await scheduler.regTask('ddhxzTask', async (request) => {
        await require('./ddhxz').doTask(request, options)
    }, taskOption)
}