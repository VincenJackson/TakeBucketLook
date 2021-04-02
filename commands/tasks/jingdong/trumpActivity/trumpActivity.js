const { w } = require("../sign/common")
const moment = require('moment')

// 京东排行榜
// https://h5.m.jd.com/babelDiy/Zeus/3wtN2MjeQgjmxYTLB3YFcHjKiUJj/index.html
var trumpActivity = {
  doTrumpTask: async (axios, options) => {
    const { task } = options
    let { data } = await axios.request({
      headers: {
        "user-agent": options.userAgent,
        "origin": `https://h5.m.jd.com`,
        "referer": `https://h5.m.jd.com/babelDiy/Zeus/3wtN2MjeQgjmxYTLB3YFcHjKiUJj/index.html`,
      },
      url: `https://api.m.jd.com/client.action?` + w({
        functionId: 'doTrumpTask',
        body: JSON.stringify({ "taskId": task.taskId, "itemId": task.taskItemInfo.itemId, "sign": 2 }),
        appid: 'content_ecology',
        clientVersion: '9.4.4',
        client: 'wh5',
      }),
      method: 'get'
    })
    if (data.code === '0') {
      if (data.result.lotteryScore) {
        console.reward('京豆', data.result.lotteryScore)
      } else {
        console.info(data.result.lotteryMsg)
      }
    } else {
      console.error(data.msg)
    }
  },
  queryTrumpTask: async (axios, options) => {
    let { data } = await axios.request({
      headers: {
        "user-agent": options.userAgent,
        "origin": `https://h5.m.jd.com`,
        "referer": `https://h5.m.jd.com/babelDiy/Zeus/3wtN2MjeQgjmxYTLB3YFcHjKiUJj/index.html`,
      },
      url: `https://api.m.jd.com/client.action?` + w({
        functionId: 'queryTrumpTask',
        body: '{"sign":2}',
        appid: 'content_ecology',
        clientVersion: '9.4.4',
        client: 'wh5',
      }),
      method: 'get'
    })
    return data.result
  },
  doTask: async (axios, options) => {
    let { taskList, signTask } = await trumpActivity.queryTrumpTask(axios, options)
    let today = moment().format('YYYY-MM-DD')
    let state = signTask.taskItemInfo.signList.find(d => d.indexOf(today) !== -1)
    if (!state) {
      let willtasks = taskList.filter(t => t.taskItemInfo.status === 0)
      console.log('未完成任务', willtasks.length)
      for (let task of willtasks) {
        console.log(task.taskName)
        await trumpActivity.doTrumpTask(axios, {
          ...options,
          task
        })
        await new Promise((resolve, reject) => setTimeout(resolve, 1 * 1000))
      }
      await trumpActivity.doTrumpTask(axios, {
        ...options,
        task: {
          "taskId": 4, taskItemInfo: { "itemId": "1" }
        }
      })
    } else {
      console.error('今日已签到')
    }
  }
}
module.exports = trumpActivity