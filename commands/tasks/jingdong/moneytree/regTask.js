// 金果摇钱树
// https://uua.jr.jd.com/uc-fe-wxgrowing/moneytree/index/?channel=yxhd
module.exports = async (scheduler, options, taskOption) => {

    options.cookies = taskOption.cookies

    // 金果摇钱树 签到
    await scheduler.regTask('moneytreeSign', async (request) => {
        await require('./moneytree').doSign(request, options)
    }, taskOption)

    // 金果摇钱树 日常任务
    await scheduler.regTask('moneytreeCompletedaliywork', async (request) => {
        await require('./moneytree').completedaliywork(request, options)
    }, {
        ...taskOption,
        ignoreRelay: true
    }, [{
        startTime: 10 * 3600
    },
    {
        startTime: 20 * 3600
    }])

    // 金果摇钱树 定时收金果
    // 根据规则每日最多18万
    await scheduler.regTask('moneytreetimeharvest', async (request) => {
        await require('./moneytree').timeharvest(request, options)
    }, {
        ...taskOption,
        isCircle: true,
        intervalTime: 600,
        startTime: 5 * 3600,
        ignoreRelay: true
    })
}