const { w, getFp, transParams } = require('../sign/common')
const { parseCookie } = require('../../../../utils/util')
const { CompleteEvent } = require('../../../../utils/EnumError')
const path = require('path')
const fs = require('fs-extra')

var newhome = {
  interact_template_getLotteryResult: async (axios, options) => {
    let { data } = await axios.request({
      headers: {
        "user-agent": options.userAgent,
        "origin": `https://h5.m.jd.com`,
        "referer": `https://h5.m.jd.com/babelDiy/Zeus/3wtN2MjeQgjmxYTLB3YFcHjKiUJj/index.html`,
      },
      url: `https://api.m.jd.com/client.action?` + w({
        functionId: 'interact_template_getLotteryResult',
        body: JSON.stringify({ "appId": "1EFRZwQ" }),
        clientVersion: '9.4.4',
        client: 'wh5',
      }),
      method: 'post'
    })
    console.info(data.data?.result?.lotteryReturnCode)
    console.info(data.data)
  },
  harmony_collectScore: async (axios, options) => {
    const { task, taskToken, actionType } = options
    let { data } = await axios.request({
      headers: {
        "user-agent": options.userAgent,
        "origin": `https://h5.m.jd.com`,
        "referer": `https://h5.m.jd.com/babelDiy/Zeus/3wtN2MjeQgjmxYTLB3YFcHjKiUJj/index.html`,
      },
      url: `https://api.m.jd.com/client.action?` + w({
        functionId: 'harmony_collectScore',
        body: JSON.stringify({
          "appId": "1EFRZwQ",
          "taskToken": taskToken,
          "taskId": task.taskId,
          "actionType": actionType || '0'
        }),
        clientVersion: '9.4.4',
        client: 'wh5',
      }),
      method: 'post'
    })
    console.info(data.data.bizMsg)
    return data.data.result
  },
  getTasks: async (axios, options) => {
    let { data } = await axios.request({
      headers: {
        "user-agent": options.userAgent,
        "origin": `https://h5.m.jd.com`,
        "referer": `https://h5.m.jd.com/babelDiy/Zeus/3wtN2MjeQgjmxYTLB3YFcHjKiUJj/index.html`,
      },
      url: `https://api.m.jd.com/client.action?` + w({
        functionId: 'healthyDay_getHomeData',
        body: JSON.stringify({ "appId": "1EFRZwQ", "taskToken": "", "channelId": 1 }),
        clientVersion: '9.4.4',
        client: 'wh5',
      }),
      method: 'post'
    })
    return data.data.result.taskVos
  },
  doTasks: async (axios, options) => {
    let n = 0
    while (n < 5) {
      let tasks = await newhome.getTasks(axios, options)
      // 14邀请好友助力 21“顾家家居”品牌会员 任务未实现
      let willtasks = tasks.filter(t => t.status == 1 && [14, 21].indexOf(t.taskType) === -1)
      console.log('剩余任务', willtasks.length)
      for (let task of willtasks) {
        console.info(task.taskType, task.taskName, '任务进度', `${task.times}/${task.maxTimes}`)
        if (task.times <= task.maxTimes) {
          if (fs.existsSync(path.join(__dirname, './taskType' + task.taskType + '.js'))) {
            await require('./taskType' + task.taskType).doTask(axios, {
              ...options,
              task,
              newhome
            })
          } else {
            console.error('未实现的任务', task.taskType, task.taskName)
          }
        } else {
          console.info('任务已完成')
        }
      }
      if (!willtasks.length) {
        break
      }
      await new Promise((resolve, reject) => setTimeout(resolve, 3 * 1000))
      n++
    }
  },
  doLottery: async (axios, options) => {
    let n = 1
    while (n <= 3) {
      console.info(`第${n}次 -300金币`)
      await newhome.interact_template_getLotteryResult(axios, options)
      await new Promise((resolve, reject) => setTimeout(resolve, 3 * 1000))
      n++
    }
  }
}
module.exports = newhome