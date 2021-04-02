module.exports = async (scheduler, options, taskOption) => {

  options.cookies = taskOption.cookies

  // 东东小窝 - 福利社抽奖
  await scheduler.regTask('jdhomeDrawTask', async (request) => {
    await require('./jdhome').doDrawTask(request, options)
  }, taskOption)

  // 东东小窝 - 日常任务
  await scheduler.regTask('jdhomeTasks', async (request) => {
    await require('./jdhome').jdhomeTasks(request, options)
  }, taskOption)

}