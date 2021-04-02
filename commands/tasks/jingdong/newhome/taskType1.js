var task = {
  doTask: async (axios, options) => {
    const { task, newhome } = options
    for (let shop of task.followShopVo) {
      if (shop.status == 1) {
        console.info('完成任务中', shop.shopName)
        await newhome.harmony_collectScore(axios, {
          ...options,
          task,
          taskToken: shop.taskToken,
          actionType: 1
        })
        await new Promise((resolve, reject) => setTimeout(resolve, 3 * 1000))
        await newhome.harmony_collectScore(axios, {
          ...options,
          task,
          taskToken: shop.taskToken,
          actionType: 0
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
}
module.exports = task