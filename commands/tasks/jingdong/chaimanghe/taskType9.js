var task = {
  doTask: async (axios, options) => {
    const { task, chaimanghe } = options
    for (let avt of task.shoppingActivityVos) {
      await chaimanghe.collectScore(axios, {
        ...options,
        task,
        taskToken: avt.taskToken,
        actionType: 1
      })
      await new Promise((resolve, reject) => setTimeout(resolve, 6 * 1000))
      await chaimanghe.collectScore(axios, {
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