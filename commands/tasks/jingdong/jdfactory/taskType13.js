var task = {
  doTask: async (axios, options) => {
    const { task, jdfactory } = options
    await jdfactory.collectScore(axios, {
      ...options,
      taskToken: task.simpleRecordInfoVo.taskToken
    })
  }
}
module.exports = task