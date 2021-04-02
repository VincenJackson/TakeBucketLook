// 京东到家
// https://daojia.jd.com/taroh5/h5dist/

module.exports = async (scheduler, options, taskOption) => {

    options.cookies = taskOption.cookies

    // 京东到家 签到
    await scheduler.regTask('daojiadosign', async (request) => {
        await require('./daojia').dosign(request, {
            ...options,
            body: { "channel": "qiandao_baibaoxiang", city_id: "2144" }
        })
    }, taskOption)

    // 京东到家 日常任务
    await scheduler.regTask('daojiacompleteTasks', async (request) => {
        await require('./daojia').completeTasks(request, options)
    }, taskOption)

}