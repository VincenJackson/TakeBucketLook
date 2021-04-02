const { reqApi } = require('./common')
var manghe = {
  queryRuleInfo: async (axios, options) => {
    let { data } = await reqApi(axios, {
      ...options,
      url: `https://lop-proxy.jd.com/MangHeApi/queryRuleInfo`,
      data: [{ "userNo": "$cooMrdGatewayUid$" }]
    })
    return data.content || []
  },
  signIn: async (axios, options) => {
    let { data } = await reqApi(axios, {
      ...options,
      url: `https://lop-proxy.jd.com/MangHeApi/signIn`,
      data: [{ "userNo": "$cooMrdGatewayUid$" }]
    })
    if (data.content?.shouldSendNo.length) {
      console.info('签到成功')
    } else {
      console.error('签到失败', data)
    }
  },
  setUserHasView: async (axios, options) => {
    let { data } = await reqApi(axios, {
      ...options,
      url: `https://lop-proxy.jd.com/MangHeApi/setUserHasView`,
      data: [{ "userNo": "$cooMrdGatewayUid$" }]
    })
    if (data?.content) {
      console.info('浏览成功')
    } else {
      console.error('浏览失败', data)
    }
  },
  getCard: async (axios, options) => {
    const { task } = options
    let { data } = await reqApi(axios, {
      ...options,
      url: `https://lop-proxy.jd.com/MangHeApi/getCard`,
      data: [{ "userNo": "$cooMrdGatewayUid$", "getCode": task.getRewardNos[0] }]
    })
    console.info('获得卡片', data.content?.card?.name || "无")
  },
  play: async (axios, options) => {
    console.info('完成任务中')
    let tasks = await manghe.queryRuleInfo(axios, options)
    let willtasks = tasks.filter(t => t.status === 1)
    for (let task of willtasks) {
      console.info(task.jumpType, task.name)
      if (task.jumpType === 31) {
        await manghe.signIn(axios, options)
      } else if (task.jumpType === 41) {
        await manghe.setUserHasView(axios, options)
      } else {
        console.error('任务未实现')
      }

      await new Promise((resolve, reject) => setTimeout(resolve, 1 * 1000))
    }

    console.info('领取奖励中')
    tasks = await manghe.queryRuleInfo(axios, options)
    willtasks = tasks.filter(t => t.status === 11)
    for (let task of willtasks) {
      await manghe.getCard(axios, {
        ...options,
        task
      })
      await new Promise((resolve, reject) => setTimeout(resolve, 1 * 1000))
    }
  }
}
module.exports = manghe