const { reqApiSign } = require('../api/client')

var threeMealInit = {
  getThreeMealReward: async (axios, options) => {
    let data = await reqApiSign(axios, {
      ...options,
      functionId: 'getThreeMealReward',
      body: {}
    })
    console.log(data)
  },
  doTask: async (axios, options) => {
    const { task, petTown } = options
    console.info('开始完成', task.title || task.taskId)
    await threeMealInit.getThreeMealReward(axios, options)
  }
}
module.exports = threeMealInit