
// 女装盲盒
// https://anmp.jd.com/babelDiy/Zeus/3gpAsWd6UBb1MWvr6PFYjNS4Nexk/index.html
module.exports = async (scheduler, options, taskOption) => {

    options.cookies = taskOption.cookies

    await scheduler.regTask('piggybankTasks', async (request) => {
        await require('./piggybank').doTask(request, options)
    }, taskOption)

}