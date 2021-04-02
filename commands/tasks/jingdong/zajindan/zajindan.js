const { reqApiNoSignWh5 } = require('../api/client')
const path = require('path')
const fs = require('fs-extra')

var zajindan = {
  getHomeData: async (axios, options) => {
    let data = await reqApiNoSignWh5(axios, {
      ...options,
      functionId: 'interact_template_getHomeData',
      body: { "appId": "1EFRQwA", "taskToken": "" }
    })
    return data.data.result
  },
  collectScore: async (axios, options) => {
    const { task, taskToken, actionType } = options
    let data = await reqApiNoSignWh5(axios, {
      ...options,
      functionId: 'harmony_collectScore',
      headers: {
        "origin": `https://h5.m.jd.com`,
        "referer": `https://h5.m.jd.com/babelDiy/Zeus/YgnrqBaEmVHWppzCgW8zjZj3VjV/index.html`,
      },
      body: {
        "appId": "1EFRQwA",
        "taskToken": taskToken,
        "taskId": task.taskId,
        "actionType": actionType || '0'
      }
    })
    console.info(data.data.bizMsg)
    return data.data.result
  },
  interact_template_getLotteryResult: async (axios, options) => {
    let data = await reqApiNoSignWh5(axios, {
      ...options,
      functionId: 'interact_template_getLotteryResult',
      body: { "appId": "1EFRQwA" }
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
    let { userInfo, taskVos } = await zajindan.getHomeData(axios, options)
    let willtasks = taskVos.filter(t => t.status === 1)
    for (let task of willtasks) {
      console.info(task.taskType, task.taskName)
      if (fs.existsSync(path.join(__dirname, './taskType' + task.taskType + '.js'))) {
        await require('./taskType' + task.taskType).doTask(axios, {
          ...options,
          task,
          zajindan
        })
      } else {
        console.error('未实现的任务', task.taskType, task.taskName)
      }
    }
    let n = Math.floor(userInfo.userScore / userInfo.scorePerLottery)
    while (n > 0) {
      await zajindan.interact_template_getLotteryResult(axios, options)
      await new Promise((resolve, reject) => setTimeout(resolve, 2 * 1000))
      n--
    }
  }
}
module.exports = zajindan