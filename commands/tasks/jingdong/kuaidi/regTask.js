module.exports = async (scheduler, options, taskOption) => {

    options.cookies = taskOption.cookies

    // 京东APP-我的-寄件服务-精彩-签到
    await scheduler.regTask('kuaidiSignin', async (request) => {
        await require('./kuaidi').signin(request, options)
    }, {
        ...taskOption,
        startTime: 7 * 3600
    })

    // 京东APP-我的-寄件服务-精彩-京小鸽寻宝寄
    await scheduler.regTask('kuaidiMangHe', async (request) => {
        await require('./manghe').play(request, options)
    }, {
        ...taskOption,
        startTime: 7 * 3600
    })

    // 京东APP-我的-寄件服务-精彩-小哥互动-每日抽奖
    await scheduler.regTask('kuaidiluckdraw', async (request) => {
        await require('./luckdraw').doTask(request, options)
    }, {
        ...taskOption,
        startTime: 7 * 3600
    })

}