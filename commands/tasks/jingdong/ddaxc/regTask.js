module.exports = async (scheduler, options, taskOption) => {

    options.cookies = taskOption.cookies

    // 东东爱消除
    await scheduler.regTask('ddaxcplay', async (request) => {
        await require('./ddaxc').doTask(request, options)
    }, {
        ...taskOption,
        startHours: 7,
        ignoreRelay: true
    })

}