const { reqApiSign, reqApiNoSignWh5 } = require('../api/client')
const path = require('path')
const fs = require('fs-extra')

var speedBuy = {
  getHomeData: async (axios, options) => {
    let data = await reqApiNoSignWh5(axios, {
      ...options,
      functionId: 'healthyDay_getHomeData',
      body: { "appId": "1EFRXxg", "taskToken": "", "channelId": 1 }
    })
    return data.data.result
  },
  partitionJdSgin: async (axios, options) => {
    let data = await reqApiSign(axios, {
      ...options,
      functionId: 'partitionJdSgin',
      body: { "version": "v2" }
    })
    if (data.result?.jdBeanNum) {
      console.reward('京豆', data.result?.jdBeanNum)
    }
  },
  collectScore: async (axios, options) => {
    const { task, taskToken, actionType } = options
    let data = await reqApiNoSignWh5(axios, {
      ...options,
      functionId: 'harmony_collectScore',
      body: { "appId": "1EFRXxg", taskToken, "taskId": task.taskId, actionType }
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
      body: { "appId": "1EFRXxg" }
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
    let { userInfo, taskVos } = await speedBuy.getHomeData(axios, options)
    let willtasks = taskVos.filter(t => t.status === 1)
    for (let task of willtasks) {
      console.info(task.taskType, task.taskName)
      if (fs.existsSync(path.join(__dirname, './taskType' + task.taskType + '.js'))) {
        await require('./taskType' + task.taskType).doTask(axios, {
          ...options,
          task,
          speedBuy
        })
        await new Promise((resolve, reject) => setTimeout(resolve, 3 * 1000))
      } else {
        console.error('未实现的任务', task.taskType, task.taskName)
      }
    }
    let n = userInfo.lotteryNum
    while (n > 0) {
      await speedBuy.interact_template_getLotteryResult(axios, options)
      await new Promise((resolve, reject) => setTimeout(resolve, 3 * 1000))
      n--
    }
  }
}
module.exports = speedBuy