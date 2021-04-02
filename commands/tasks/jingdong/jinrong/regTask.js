module.exports = async (scheduler, options, taskOption) => {

    options.cookies = taskOption.cookies

    // 京东金融 钢镚签到
    await scheduler.regTask('jrSteelSignin', async (request) => {
        await require('./jinrong').steelSignin(request, options)
    }, {
        ...taskOption,
        startTime: 6 * 3600,
        ignoreRelay: true
    })

    // 京东金融 签到
    await scheduler.regTask('jrSignin', async (request) => {
        await require('./jinrong').signin(request, options)
    }, {
        ...taskOption,
        startTime: 6 * 3600,
        ignoreRelay: true
    })

    // 京东金融 双签
    await scheduler.regTask('jrDoubleSignin', async (request) => {
        await require('./jinrong').DoubleSignin_xianjin(request, options)
        await require('./jinrong').DoubleSignin_jindou(request, options)
        // await require('./jinrong').DoubleSignin_jintie(request, options)
        await require('./jinrong').Signin1(request, options)
        await require('./jinrong').Signin2(request, options)
        await require('./jinrong').Signin3(request, options)
        await require('./jinrong').Signin4(request, options)
        await require('./jinrong').Signin5(request, options)
    }, {
        ...taskOption,
        startTime: 8 * 3600,
        ignoreRelay: true
    })

    // 京东金融 天天提鹅 签到
    await scheduler.regTask('ttteSignin', async (request) => {
        await require('./ttte').toDailyHome(request, options)
        await require('./ttte').DailySignIn(request, options)
    }, {
        ...taskOption,
        startTime: 6 * 3600
    })


    // 京东金融 天天提鹅 收取鹅蛋
    await scheduler.regTask('ttteCollectEgg', async (request) => {
        await require('./ttte').collectEgg(request, options)
    }, {
        ...taskOption,
        isCircle: true,
        intervalTime: 10 * 60,
        startTime: 6 * 3600,
        ignoreRelay: true
    })

}