
const { reqApiSign } = require('../api/client')

var feedReachInit = {
  getFeedReachReward: async (axios, options) => {
    let data = await reqApiSign(axios, {
      ...options,
      functionId: 'getFeedReachReward',
      body: {}
    })
    console.log(data)
  },
  doTask: async (axios, options) => {
    const { task, petTown } = options
    console.info('开始完成', task.title || task.taskId)

    let n = (task.feedReachAmount - task.hadFeedAmount) / 10
    console.log('剩余需要', n, '次投喂')
    while (n > 0) {
      console.log('第', n, '次')
      await petTown.feedPets(axios, options)
      await new Promise((resolve, reject) => setTimeout(resolve, 3 * 1000))
      n--
    }
    await feedReachInit.getFeedReachReward(axios, options)
  }
}
module.exports = feedReachInit