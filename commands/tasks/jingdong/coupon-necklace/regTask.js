module.exports = async (scheduler, options, taskOption) => {

    // 领券中心签到
    await scheduler.regTask('necklaceCCSign', async (request) => {
        await require('./coupon-necklace').cc_sign(request, options)
    }, taskOption)

    // 每日福利 0点场 20点场
    await scheduler.regTask('necklaceSign', async (request) => {
        await require('./coupon-necklace').necklace_sign(request, options)
    }, {
        ...taskOption
    }, [{
        startTime: 6 * 3600
    },
    {
        startTime: 20 * 3600,
    }])

    // 日常任务
    await scheduler.regTask('necklaceTask', async (request) => {
        await require('./coupon-necklace').doTask(request, options)
    }, taskOption)

}