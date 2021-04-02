
const { reqApiSign } = require('../api/client')

var browseSingleShopInit = {
  getSingleShopReward: async (axios, options) => {
    const { type } = options
    let data = await reqApiSign(axios, {
      ...options,
      functionId: 'getSingleShopReward',
      body: { "index": 1, "type": type, "version": 1 }
    })
    console.log(data)
  },
  doTask: async (axios, options) => {
    const { task, petTown } = options
    console.info('开始完成', task.title || task.taskId)
    await browseSingleShopInit.getSingleShopReward(axios, {
      ...options,
      type: 1
    })
    await new Promise((resolve, reject) => setTimeout(resolve, 3 * 1000))
    await browseSingleShopInit.getSingleShopReward(axios, {
      ...options,
      type: 2
    })
  }
}
module.exports = browseSingleShopInit