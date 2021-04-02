const { reqApiSign, reqApiNoSignWh5 } = require('../api/client')
const path = require('path')
const fs = require('fs-extra')
var ddhxz = {
  getHomeData: async (axios, options) => {
    let data = await reqApiNoSignWh5(axios, {
      ...options,
      functionId: 'healthyDay_getHomeData',
      body: { "appId": "1EFRZwA", "taskToken": "", "channelId": 1 }
    })
    return data.data.result
  },
  collectScore: async (axios, options) => {
    const { task, taskToken, actionType } = options
    let data = await reqApiNoSignWh5(axios, {
      ...options,
      functionId: 'harmony_collectScore',
      body: { "appId": "1EFRZwA", taskToken, "taskId": task.taskId, actionType }
    })
    if (data.code === 0) {
      console.info(data.data.bizMsg)
    } else {
      console.error('完成失败', data)
    }
  },
  interact_template_getLotteryResult: async (axios, options) => {
    let data = await reqApiNoSignWh5(axios, {
      ...options,
      functionId: 'interact_template_getLotteryResult',
      body: { "appId": "1EFRZwA" }
    })
    if (data.code === 0) {
      let jBeanAwardVo = data?.data?.result?.userAwardsCacheDto?.jBeanAwardVo
      if (jBeanAwardVo) {
        console.reward('京豆', jBeanAwardVo.quantity)
      }
    } else {
      console.error('抽奖失败', data)
    }
  },
  doTask: async (axios, options) => {
    let willtasks = []
    let userInfo = {}
    let m = 5
    do {
      let { userInfo: userInfo1, taskVos } = await ddhxz.getHomeData(axios, options)
      willtasks = taskVos.filter(t => t.status === 1 && [14, 21].indexOf(t.taskType) === -1)
      userInfo = userInfo1
      for (let task of willtasks) {
        console.info(task.taskType, task.taskName)
        if (fs.existsSync(path.join(__dirname, './taskType' + task.taskType + '.js'))) {
          await require('./taskType' + task.taskType).doTask(axios, {
            ...options,
            task,
            ddhxz
          })
        } else {
          console.error('未实现的任务', task.taskType, task.taskName)
        }
      }
      m--
    } while (m > 0)

    let n = Math.floor(userInfo.userScore / userInfo.scorePerLottery)
    while (n > 0) {
      await ddhxz.interact_template_getLotteryResult(axios, options)
      await new Promise((resolve, reject) => setTimeout(resolve, 2 * 1000))
      n--
    }
  }
}
module.exports = ddhxz