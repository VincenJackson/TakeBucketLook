
module.exports = async (scheduler, options, taskOption) => {

  options.cookies = taskOption.cookies

  // 玩游戏送京豆
  await scheduler.regTask('playMiniGame', async (request) => {
    await require('./game').doTask(request, options)
  }, {
    ...taskOption
  }, [{
    startTime: 8 * 3600
  },
  {
    startTime: 20 * 3600
  }])
}