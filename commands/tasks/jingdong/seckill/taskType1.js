var task = {
  doTask: async (axios, options) => {
    const { seckill, projectId, task } = options
    if (task?.ext?.extraType === 'browseShop') {
      let i = task.assignmentTimesLimit
      for (let shop of task?.ext?.browseShop) {
        if (i <= 0) {
          break
        }
        await seckill.doInteractiveAssignment(axios, {
          ...options,
          projectId,
          task,
          item: {
            id: shop.itemId
          },
          actionType: 1
        })
        await new Promise((resolve, reject) => setTimeout(resolve, Math.max(3, task?.ext?.waitDuration) * 1000))
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
    } else if (task?.ext?.extraType === 'productsInfo') {
      let i = task.assignmentTimesLimit
      for (let shop of task?.ext?.productsInfo) {
        if (i <= 0) {
          break
        }
        await seckill.doInteractiveAssignment(axios, {
          ...options,
          projectId,
          task,
          item: {
            id: shop.skuId
          },
          actionType: 1
        })
        await new Promise((resolve, reject) => setTimeout(resolve, Math.max(3, task?.ext?.waitDuration) * 1000))
        await seckill.doInteractiveAssignment(axios, {
          ...options,
          projectId,
          task,
          item: {
            id: shop.skuId
          },
          actionType: 0
        })
        await new Promise((resolve, reject) => setTimeout(resolve, 1 * 1000))
        await require('../api/product').DelProductFav(axios, {
          ...options,
          good: {
            sku: shop.skuId
          }
        })
        i--
      }
    } else if (task?.ext?.extraType === 'shoppingActivity') {
      let i = task.assignmentTimesLimit
      for (let shop of task?.ext?.shoppingActivity) {
        if (i <= 0) {
          break
        }
        await seckill.doInteractiveAssignment(axios, {
          ...options,
          projectId,
          task,
          item: {
            id: shop.itemId
          },
          actionType: 1
        })
        await new Promise((resolve, reject) => setTimeout(resolve, Math.max(3, task?.ext?.waitDuration) * 1000))
        await seckill.doInteractiveAssignment(axios, {
          ...options,
          projectId,
          task,
          item: {
            id: shop.itemId
          },
          actionType: 0
        })
        i--
      }
    }
  }
}
module.exports = task