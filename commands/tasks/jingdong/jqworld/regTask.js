module.exports = async (scheduler, options, taskOption) => {

    options.cookies = taskOption.cookies

    // 京奇世界 签到
    await scheduler.regTask('jqworldSign', async (request) => {
        await require('./jqworld').gameTaskStatusUpdate(request, {
            ...options,
            task: { "category": "c1", "taskId": 1 },
            operateType: 1
        })
    }, {
        ...taskOption,
        startTime: 7 * 3600,
        ignoreRelay: true
    })

    // 京奇世界 日常任务
    await scheduler.regTask('jqworldCompleteTasks', async (request) => {
        await require('./jqworld').completeTasks(request, options)
    }, {
        ...taskOption,
        startHours: 7,
        ignoreRelay: true
    })

}