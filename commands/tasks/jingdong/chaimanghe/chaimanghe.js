const { reqApiSign, reqApiNoSignWh5 } = require('../api/client')
const path = require('path')
const fs = require('fs-extra')
var chaimanghe = {
  getHomeData: async (axios, options) => {
    let data = await reqApiNoSignWh5(axios, {
      ...options,
      functionId: 'healthyDay_getHomeData',
      body: { "appId": "1EFRZxQ", "taskToken": "", "channelId": 1 }
    })
    return data.data.result
  },
  signin: async (axios, options) => {
    let data = await reqApiNoSignWh5(axios, {
      ...options,
      functionId: 'harmony_collectScore',
      body: { "appId": "1EFRZxQ", "taskToken": "P22v_x2QR8a90nTJx38k_EIcACjVemYaR5jQ", "taskId": 1, "actionType": "0" }
    })
    if (data.data.bizCode === 0) {
      console.info('签到成功', '获得金币', data.data.result.score)
    } else {
      console.error(data.data.bizMsg)
    }
  },
  collectScore: async (axios, options) => {
    const { task, taskToken, actionType } = options
    let data = await reqApiNoSignWh5(axios, {
      ...options,
      functionId: 'harmony_collectScore',
      body: { "appId": "1EFRZxQ", taskToken, "taskId": task.taskId, actionType }
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
      body: { "appId": "1EFRZxQ" }
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
    let { userInfo, taskVos } = await chaimanghe.getHomeData(axios, options)
    let willtasks = taskVos.filter(t => t.status === 1)
    for (let task of willtasks) {
      console.info(task.taskType, task.taskName)
      if (fs.existsSync(path.join(__dirname, './taskType' + task.taskType + '.js'))) {
        await require('./taskType' + task.taskType).doTask(axios, {
          ...options,
          task,
          chaimanghe
        })
      } else {
        console.error('未实现的任务', task.taskType, task.taskName)
      }
    }
    let n = Math.floor(userInfo.userScore / userInfo.scorePerLottery)
    while (n > 0) {
      await chaimanghe.interact_template_getLotteryResult(axios, options)
      await new Promise((resolve, reject) => setTimeout(resolve, 2 * 1000))
      n--
    }
  }
}
module.exports = chaimanghe