
const { reqApiSign } = require('../api/client')
var petSport = {
  petSport: async (axios, options) => {
    let data = await reqApiSign(axios, {
      ...options,
      functionId: 'petSport',
      body: { "version": 1 }
    })
    console.log(data)
  },
  getSportReward: async (axios, options) => {
    let data = await reqApiSign(axios, {
      ...options,
      functionId: 'getSportReward',
      body: { "version": 1 }
    })
    console.log(data)
  },
  doTask: async (axios, options) => {
    const { task, petTown } = options
    console.info('开始完成', task.title || task.taskId)
    await petSport.petSport(axios, options)
    await new Promise((resolve, reject) => setTimeout(resolve, 10 * 1000))
    await petSport.getSportReward(axios, options)
  }
}
module.exports = petSport