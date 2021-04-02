module.exports = async (scheduler, options, taskOption) => {

    options.cookies = taskOption.cookies
    
    await scheduler.regTask('carnivalcity', async (request) => {
        await require('./carnivalcity').doTask(request, options)
    }, taskOption)

}