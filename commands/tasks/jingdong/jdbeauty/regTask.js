module.exports = async (scheduler, options, taskOption) => {

    options.cookies = taskOption.cookies

    // 东东美丽颜究院 日常任务
    // 执行频繁或者错误过多,极易被BAN IP导致403错误
    // 暂时不自动执行
    await scheduler.regTask('jdbeautyCompleteTask', async (request) => {
        await require('./jdbeauty').doTask(request, options)
    }, {
        ...taskOption,
        ignore: true
    }, [{
        startTime: 8 * 3600
    },
    {
        startTime: 12 * 3600
    },
    {
        startTime: 19 * 3600,
    }])
}