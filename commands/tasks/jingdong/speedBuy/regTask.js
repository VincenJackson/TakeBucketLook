module.exports = async (scheduler, options, taskOption) => {

  options.cookies = taskOption.cookies

  // 品牌闪购-每日签到
  await scheduler.regTask('speedBuyJdSgin', async (request) => {
    await require('./speedBuy').partitionJdSgin(request, options)
  }, taskOption)

  // 品牌闪购-闪购盲盒日常任务
  await scheduler.regTask('speedBuyTask', async (request) => {
    await require('./speedBuy').doTask(request, options)
  }, taskOption)

}