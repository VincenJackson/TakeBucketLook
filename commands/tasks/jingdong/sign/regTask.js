module.exports = async (scheduler, options, taskOption) => {

    options.cookies = taskOption.cookies

    // 签到日历签到
    await scheduler.regTask('signCalendar', async (request) => {
        await require('./signCalendar').doTask(request, options)
    }, {
        ...taskOption,
        endHours: 15
    })

    // 京东美妆签到
    await scheduler.regTask('meizhuanguan', async (request) => {
        await require('./meizhuanguan').doTask(request, options)
    }, {
        ...taskOption,
        endHours: 13
    })

    // 京东清洁管签到
    await scheduler.regTask('qingjieguan', async (request) => {
        await require('./qingjieguan').doTask(request, options)
    }, {
        ...taskOption,
        endHours: 13
    })

    // 京东校园-花YOUNG签到
    await scheduler.regTask('schoolyoung', async (request) => {
        await require('./schoolyoung').doTask(request, options)
    }, {
        ...taskOption,
        endHours: 13
    })

    // 京东 摇京豆->领金豆
    // https://bean.m.jd.com
    // https://h5.m.jd.com/rn/2E9A2bEeqQqBP9juVgPJvQQq6fJ/index.html
    await scheduler.regTask('beanHomeTask', async (request) => {
        await require('./beanHomeTask').doTask(request, options)
    }, {
        ...taskOption,
        endHours: 14
    })

    // 京东鞋靴馆签到
    await scheduler.regTask('xiexueguan', async (request) => {
        await require('./xiexueguan').doTask(request, options)
    }, {
        ...taskOption,
        endHours: 13
    })

    // 京东箱包馆签到
    await scheduler.regTask('xiangbaoguan', async (request) => {
        await require('./xiangbaoguan').doTask(request, options)
    }, {
        ...taskOption,
        endHours: 13
    })

    // 京东女装馆签到
    await scheduler.regTask('nvzhuangguan', async (request) => {
        await require('./nvzhuangguan').doTask(request, options)
    }, {
        ...taskOption,
        endHours: 13
    })

    // 京东图书馆签到
    await scheduler.regTask('tushuguan', async (request) => {
        await require('./tushuguan').doTask(request, options)
    }, {
        ...taskOption,
        endHours: 13
    })

    // 个护馆签到
    await scheduler.regTask('gehuguan', async (request) => {
        await require('./gehuguan').doTask(request, options)
    }, {
        ...taskOption,
        endHours: 13
    })

    // 母婴馆签到
    await scheduler.regTask('muyingguan', async (request) => {
        await require('./muyingguan').doTask(request, options)
    }, {
        ...taskOption,
        endHours: 13
    })

    // 童装馆签到
    await scheduler.regTask('tongzhuangguan', async (request) => {
        await require('./tongzhuangguan').doTask(request, options)
    }, {
        ...taskOption,
        endHours: 13
    })

    // 数码电器馆签到
    await scheduler.regTask('shumadianqi', async (request) => {
        await require('./shumadianqi').doTask(request, options)
    }, {
        ...taskOption,
        endHours: 13
    })

    // 京东服饰馆签到
    await scheduler.regTask('fushiguan', async (request) => {
        await require('./fushiguan').doTask(request, options)
    }, {
        ...taskOption,
        endHours: 13
    })

    // 京东拍卖签到
    await scheduler.regTask('jingdongpaimai', async (request) => {
        await require('./jingdongpaimai').doTask(request, options)
    }, {
        ...taskOption,
        endHours: 13
    })

    // 京东拍拍二手
    await scheduler.regTask('paipaiershou', async (request) => {
        await require('./paipaiershou').doTask(request, options)
    }, {
        ...taskOption,
        endHours: 13
    })

    // 京东健康馆
    await scheduler.regTask('jingdongjiankang', async (request) => {
        await require('./jingdongjiankang').doTask(request, options)
    }, {
        ...taskOption,
        endHours: 13
    })

    // 京东珠宝
    await scheduler.regTask('zhubaoguan', async (request) => {
        await require('./zhubaoguan').doTask(request, options)
    }, {
        ...taskOption,
        endHours: 13
    })

    // 京东内衣馆签到
    await scheduler.regTask('neiyiguan', async (request) => {
        await require('./neiyiguan').doTask(request, options)
    }, {
        ...taskOption,
        endHours: 13
    })

    // 京喜现金签到
    await scheduler.regTask('pgcentersign', async (request) => {
        await require('./pgcenter').sign(request, options)
    }, {
        ...taskOption,
        endHours: 13
    })
}