module.exports = async (scheduler, options, taskOption) => {

    // 个护馆-各户个护爱消除
    await scheduler.regTask('gehuguanPlay', async (request) => {
        await require('./gehuguan').doTask(request, options)
    }, taskOption)

}