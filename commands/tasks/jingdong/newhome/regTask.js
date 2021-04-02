
// 东东换新家
// https://h5.m.jd.com/babelDiy/Zeus/42ZqCcPC9am8tkQgTJXKSnK1rNjx/index.html
module.exports = async (scheduler, options, taskOption) => {

    options.cookies = taskOption.cookies

    // 东东换新家 日常抽奖
    await scheduler.regTask('newhomeLottery', async (request) => {
        await require('./newhome').doLottery(request, options)
    }, taskOption)

    // 东东换新家 日常任务
    await scheduler.regTask('newhomeTasks', async (request) => {
        await require('./newhome').doTasks(request, options)
    }, taskOption)
}