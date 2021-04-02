var task = {
  doTask: async (axios, options) => {
    const { task, zajindan } = options
    for (let shop of task.followShopVo) {
      await zajindan.collectScore(axios, {
        ...options,
        task,
        taskToken: shop.taskToken,
        actionType: 1
      })
      await new Promise((resolve, reject) => setTimeout(resolve, 7 * 1000))
      await zajindan.collectScore(axios, {
        ...options,
        task,
        taskToken: shop.taskToken,
        actionType: 0
      })
      await require('../api/shop').DelShopFav(axios, {
        ...options,
        referer: 'https://shop.m.jd.com/',
        params: {
          shopId: shop.shopId,
          venderId: shop.venderId
        }
      })
    }
  }
}
module.exports = task