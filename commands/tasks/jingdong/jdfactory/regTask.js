module.exports = async (scheduler, options, taskOption) => {

  options.cookies = taskOption.cookies

  // 东东工厂
  await scheduler.regTask('jdfactoryTask', async (request) => {
    await require('./jdfactory').doTask(request, options)
  }, taskOption)

  // 东东工厂 - 数码首页
  await scheduler.regTask('jdfactoryShuMaTask', async (request) => {
    await require('./jdfactory').doShuMa(request, options)
  }, taskOption)

  // 东东工厂 - 每日充电
  await scheduler.regTask('jdfactoryAddEnergy', async (request) => {
    await require('./jdfactory').addEnergy(request, options)
  }, {
    ...taskOption
  }, [{
    startTime: 12 * 3600
  }, {
    startTime: 20 * 3600
  }])

  // 东东工厂 - 每日巡场
  await scheduler.regTask('jdfactoryXunChang', async (request) => {
    await require('./jdfactory').doXunChang(request, options)
  }, {
    ...taskOption,
    startTime: 11 * 3600,
  })

  // 东东工厂 - 定时收集发电机电力
  await scheduler.regTask('jdfactoryElectricity', async (request) => {
    await require('./jdfactory').collectElectricity(request, options)
  }, {
    ...taskOption,
    isCircle: true,
    intervalTime: 600,
    startTime: 0,
    ignoreRelay: true
  })
}