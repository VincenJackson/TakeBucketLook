var task = {
  doTask: async (axios, options) => {
    const { task, jdfactory } = options
    let n = task.maxTimes - task.times
    for (let shop of task.followShopVo) {
      await jdfactory.collectScore(axios, {
        ...options,
        taskToken: shop.taskToken
      })
      await new Promise((resolve, reject) => setTimeout(resolve, 3 * 1000))
      await require('../api/shop').DelShopFav(axios, {
        ...options,
        referer: 'https://shop.m.jd.com/',
        params: {
          shopId: shop.shopId
        }
      })
    }
  }
}
module.exports = task