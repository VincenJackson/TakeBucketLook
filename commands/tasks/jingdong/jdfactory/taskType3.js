var task = {
  doTask: async (axios, options) => {
    const { task, jdfactory } = options
    let n = task.maxTimes - task.times
    for (let shop of task.shoppingActivityVos) {
      // shop.itemId
      await jdfactory.collectScore(axios, {
        ...options,
        taskToken: shop.taskToken
      })
      await new Promise((resolve, reject) => setTimeout(resolve, 3 * 1000))
    }
  }
}
module.exports = task