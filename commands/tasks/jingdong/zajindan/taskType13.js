var task = {
  doTask: async (axios, options) => {
    const { task, zajindan } = options
    await zajindan.collectScore(axios, {
      ...options,
      task,
      taskToken: task.simpleRecordInfoVo.taskToken,
      actionType: 0
    })
  }
}
module.exports = task