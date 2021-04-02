var task = {
  doTask: async (axios, options) => {
    const { seckill, projectId, task } = options
    let i = task.assignmentTimesLimit
    while (i > 0) {
      await seckill.doInteractiveAssignment(axios, {
        ...options,
        projectId,
        task,
        item: {
          id: ""
        },
        actionType: 0,
        completionFlag: true
      })
      await new Promise((resolve, reject) => setTimeout(resolve, 1 * 1000))
      i--
    }
  }
}
module.exports = task