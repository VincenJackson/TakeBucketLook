module.exports = async (scheduler, options, taskOption) => {

  // 种豆得豆-签到领取营养液
  await scheduler.regTask('plantBeanCompleteTasks', async (request) => {
    await require('./plantBean').completeTasks(request, options)
  }, {
    ...taskOption,
    startHours: 10
  })

  // 种豆得豆-每周一瓜分上轮京豆
  await scheduler.regTask('plantBeanreceivedBean', async (request) => {
    await require('./plantBean').receivedBean(request, options)
  }, {
    ...taskOption,
    startTime: 9 * 3600
  })

  await scheduler.regTask('plantBeanCultureBean', async (request) => {
    await require('./plantBean').cultureBean(request, { ...options, nutrientsType: '1' })
    await require('./plantBean').cultureBean(request, { ...options, nutrientsType: '13' })
    await require('./plantBean').cultureBean(request, { ...options, nutrientsType: '-1' })
    await require('./plantBean').cultureBean(request, { ...options, nutrientsType: '1' })
  }, {
    ...taskOption,
    startTime: 18 * 3600,
    ignoreRelay: true
  })

  // 种豆得豆-自动领取营养液+3
  await scheduler.regTask('plantBeanReceiveNutrients', async (request) => {
    await require('./plantBean').receiveNutrients(request, options)
  }, {
    ...taskOption,
    isCircle: true,
    intervalTime: 3 * 3600,
    startTime: 7 * 3600,
    ignoreRelay: true
  })

}