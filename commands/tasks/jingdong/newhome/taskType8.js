var task = {
  doTask: async (axios, options) => {
    const { task, newhome } = options
    for (let product of task.productInfoVos) {
      if (product.status == 1) {
        console.info('完成任务中', product.skuName)
        await newhome.harmony_collectScore(axios, {
          ...options,
          task,
          taskToken: product.taskToken,
          actionType: 1
        })
        await new Promise((resolve, reject) => setTimeout(resolve, 6 * 1000))
        await newhome.harmony_collectScore(axios, {
          ...options,
          task,
          taskToken: product.taskToken,
          actionType: 0
        })
      }
    }
  }
}
module.exports = task