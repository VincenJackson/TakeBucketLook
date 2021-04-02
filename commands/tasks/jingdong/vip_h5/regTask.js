module.exports = async (scheduler, options, taskOption) => {

    options.cookies = taskOption.cookies

    // 京东APP-我的-京东会员-摇一摇签到
    await scheduler.regTask('viph5SharkSignin', async (request) => {
        await require('./vip_h5').vvipclub_shaking(request, options)
        await require('./vip_h5').pg_channel_sign(request, options)
    }, {
        ...taskOption,
        startTime: 7 * 3600
    })

    // 京东APP-我的-京东会员-摇京豆
    await scheduler.regTask('viph5SharkBean', async (request) => {
        await require('./vip_h5').sharkBean(request, options)
    }, {
        ...taskOption,
        startTime: 7 * 3600
    })

    // 京东APP-我的-京东会员-兑权益-抽大奖
    await scheduler.regTask('vvipscdp', async (request) => {
        await require('./vvipscdp').vvipscdp_raffle_auto_send_bean(request, options)
    }, {
        ...taskOption,
        endHours: 13
    })

}