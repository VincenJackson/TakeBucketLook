module.exports = async (scheduler, options, taskOption) => {

  options.cookies = taskOption.cookies

  // 京东排行榜
  await scheduler.regTask('trumpActivity', async (request) => {
    await require('./trumpActivity').doTask(request, options)
  }, {
    ...taskOption,
    startTime: 8 * 3600,
    ignoreRelay: true
  })

}