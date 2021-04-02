var shareTask = {
  doTask: async (axios, options) => {
    const { task } = options
    let livedata = await require('../api/live').liveDetailV910(axios, {
      ...options,
      task
    })
    await require('../api/live').liveauth(axios, {
      ...options,
      task,
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
    await require('../api/live').liveChannelReportDataV912(axios, { ...options, type: "shareTask", livedata, extra: { num: 1 } })
  }
}
module.exports = shareTask