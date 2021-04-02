const { reqApi } = require('./common')
var kuaidi = {
  detail: async (axios, options) => {
    let { data } = await reqApi(axios, {
      ...options,
      url: `https://lop-proxy.jd.com/jiFenApi/signInQuery`,
      data: [{ "userNo": "$cooMrdGatewayUid$" }]
    })
    return data.content.hasSignInToday
  },
  signInAndGetReward: async (axios, options) => {
    let { data } = await reqApi(axios, {
      ...options,
      url: `https://lop-proxy.jd.com/jiFenApi/signInAndGetReward`,
      data: [{ "userNo": "$cooMrdGatewayUid$" }]
    })
    if (data.success) {
      console.info('京东快递签到成功')
      if (data.content && data.content[0].jdBeanDTO) {
        console.reward('京豆', data.content[0].jdBeanDTO.sendNum)
      }
    } else {
      console.error('京东快递签到失败', data.errorMsg)
    }
  },
  signin: async (axios, options) => {
    let hasSign = await kuaidi.detail(axios, options)
    if (!hasSign) {
      await kuaidi.signInAndGetReward(axios, options)
    } else {
      console.error('今日已签到')
    }
  }
}
module.exports = kuaidi