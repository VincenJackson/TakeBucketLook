var task = {
  doTask: async (axios, options) => {
    const { seckill, projectId, task } = options
    if (task?.ext?.extraType === 'followShop') {
      let i = task.assignmentTimesLimit
      for (let shop of task?.ext?.followShop) {
        if (i <= 0) {
          break
        }
        await require('../api/shop').AddShopFav(axios, {
          ...options,
          referer: 'https://shop.m.jd.com/',
          params: {
            shopId: shop.itemId
          }
        })
        await new Promise((resolve, reject) => setTimeout(resolve, 1 * 1000))
        await seckill.doInteractiveAssignment(axios, {
          ...options,
          projectId,
          task,
          item: {
            id: shop.itemId
          },
          actionType: 0
        })
        await new Promise((resolve, reject) => setTimeout(resolve, 1 * 1000))
        await require('../api/shop').DelShopFav(axios, {
          ...options,
          referer: 'https://shop.m.jd.com/',
          params: {
            shopId: shop.itemId
          }
        })
        i--
      }
    }
  }
}
module.exports = task