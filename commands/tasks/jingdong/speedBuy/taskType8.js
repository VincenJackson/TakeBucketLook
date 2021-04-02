var task = {
  doTask: async (axios, options) => {
    const { task, speedBuy } = options
    for (let product of task.productInfoVos) {
      await speedBuy.collectScore(axios, {
        ...options,
        task,
        taskToken: product.taskToken,
        actionType: 1
      })
      await new Promise((resolve, reject) => setTimeout(resolve, 6 * 1000))
      await speedBuy.collectScore(axios, {
        ...options,
        task,
        taskToken: product.taskToken,
        actionType: 0
      })
      await require('../api/product').DelProductFav(axios, {
        ...options,
        good: {
          sku: product.skuId
        }
      })
    }
  }
}
module.exports = task