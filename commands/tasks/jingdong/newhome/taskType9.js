var task = {
  doTask: async (axios, options) => {
    const { task, newhome } = options
    await newhome.harmony_collectScore(axios, {
      ...options,
      task,
      taskToken: task.shoppingActivityVos[0].taskToken,
      actionType: 1
    })
    await new Promise((resolve, reject) => setTimeout(resolve, 6 * 1000))
    await newhome.harmony_collectScore(axios, {
      ...options,
      task,
      taskToken: task.shoppingActivityVos[0].taskToken,
      actionType: 0
    })
  }
}
module.exports = task