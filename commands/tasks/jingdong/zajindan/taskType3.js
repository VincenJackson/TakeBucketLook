var task = {
  doTask: async (axios, options) => {
    const { task, zajindan } = options
    for (let avt of task.shoppingActivityVos) {
      await zajindan.collectScore(axios, {
        ...options,
        task,
        taskToken: avt.taskToken,
        actionType: 0
      })
      await new Promise((resolve, reject) => setTimeout(resolve, 1 * 1000))
    }
  }
}
module.exports = task