
const { reqApiSign } = require('../api/client')
var firstFeedInit = {
  getFirstFeedReward: async (axios, options) => {
    let data = await reqApiSign(axios, {
      ...options,
      functionId: 'getFirstFeedReward',
      body: {}
    })
    console.log(data)
  },
  doTask: async (axios, options) => {
    const { task, petTown } = options
    console.info('开始完成', task.title || task.taskId)
    await petTown.feedPets(axios, options)
    await firstFeedInit.getFirstFeedReward(axios, options)
  }
}
module.exports = firstFeedInit