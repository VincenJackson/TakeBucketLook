var commonViewTask = {
  doTask: async (axios, options) => {
    const { liveId } = options
    let livedata = await require('../api/live').liveDetailV910(axios, {
      ...options,
      liveId
    })
    await require('../api/live').liveauth(axios, {
      ...options,
      livedata
    })
    await require('../api/live').liveChannelReportSwitchV912(axios, {
      ...options,
      livedata
    })
    await require('../api/live').liveActivityV842(axios, {
      ...options,
      livedata
    })
    let time = 0
    while (time <= 60) {
      await require('../api/live').liveChannelReportDataV912(axios, { ...options, type: "viewTask", livedata, extra: { "time": time } })
      await new Promise((resolve, reject) => setTimeout(resolve, 30 * 1000))
      time += 30
    }
    await new Promise((resolve, reject) => setTimeout(resolve, 5 * 1000))
    await require('../api/live').liveChannelReportDataV912(axios, { ...options, type: "fansViewTask", livedata, extra: { "time": 65 } })
  }
}
module.exports = commonViewTask