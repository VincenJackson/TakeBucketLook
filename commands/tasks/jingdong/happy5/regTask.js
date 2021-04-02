module.exports = async (scheduler, options, taskOption) => {

    options.cookies = taskOption.cookies

    // 领券中心-疯狂星期五
    await scheduler.regTask('happy5Tasks', async (request) => {
        await require('./happy5').doTask(request, options)
    }, {
        ...taskOption
    })

}