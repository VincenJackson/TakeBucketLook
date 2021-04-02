module.exports = async (scheduler, options, taskOption) => {

  // 京东-积分加油站签到
  await scheduler.regTask('jd_jf_signign', async (request) => {
    await require('./jifen').jd_jf_sign(request, options)
  }, taskOption)

}