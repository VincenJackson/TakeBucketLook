
const { reqApiSign } = require('../api/client')
var signInit = {
  getSignReward: async (axios, options) => {
    let data = await reqApiSign(axios, {
      ...options,
      functionId: 'getSignReward',
      body: {}
    })
    console.log(data)
  },
  doTask: async (axios, options) => {
    const { task, petTown } = options
    console.info('开始完成', task.title || task.taskId)
    await signInit.getSignReward(axios, options)
  }
}
module.exports = signInit