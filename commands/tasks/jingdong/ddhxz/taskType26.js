var task = {
  doTask: async (axios, options) => {
    const { task, ddhxz } = options
    for (let avt of task.shoppingActivityVos) {
      await ddhxz.collectScore(axios, {
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