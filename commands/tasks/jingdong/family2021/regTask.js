module.exports = async (scheduler, options, taskOption) => {

    // 京东辛福家攒幸福收益
    await scheduler.regTask('family2021Tasks', async (request) => {
        await require('./family2021').doTask(request, options)
    }, {
        ...taskOption
    }, [{
        startTime: 10 * 3600,
    }, {
        startTime: 19 * 3600,
    }])


    // 京东辛福家兑换京豆
    await scheduler.regTask('family2021Bean', async (request) => {
        await require('./family2021').doDrawTask(request, options)
    }, {
        ...taskOption
    }, [{
        startTime: 20 * 3600,
    }])

}