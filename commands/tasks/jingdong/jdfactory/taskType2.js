var task = {
  doTask: async (axios, options) => {
    const { task, jdfactory } = options
    let n = task.maxTimes - task.times
    for (let pro of task.productInfoVos) {
      await jdfactory.collectScore(axios, {
        ...options,
        taskToken: pro.taskToken
      })
      await new Promise((resolve, reject) => setTimeout(resolve, 3 * 1000))
    }
  }
}
module.exports = task