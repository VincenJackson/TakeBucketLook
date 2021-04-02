const { w, getFp } = require('./common')
const { parseCookie } = require('../../../../utils/util')

// 京东内衣馆签到
// https://pro.m.jd.com/mall/active/4PgpL1xqPSW1sVXCJ3xopDbB1f69/index.html
var neiyiguan = {
  detail: async (axios, options) => {
    let { data } = await axios.request({
      headers: {
        "user-agent": options.userAgent,
        "origin": "https://pro.m.jd.com",
        "referer": `https://pro.m.jd.com/mall/active/4PgpL1xqPSW1sVXCJ3xopDbB1f69/index.html`,
        "X-Requested-With": "com.jingdong.app.mall"
      },
      url: `https://jdjoy.jd.com/api/turncard/channel/detail?` + w({
        turnTableId: 1071,
        invokeKey: 'yPsq1PHN'
      }),
      method: 'get'
    })
    return data.data.hasSign
  },
  sign: async (axios, options) => {

    let cookies = parseCookie(options.cookies, ['3AB9D23F7A4B3C9B'])

    let { data } = await axios.request({
      headers: {
        "user-agent": options.userAgent,
        "origin": "https://pro.m.jd.com",
        "referer": `https://pro.m.jd.com/mall/active/4PgpL1xqPSW1sVXCJ3xopDbB1f69/index.html`,
        "X-Requested-With": "com.jingdong.app.mall"
      },
      url: `https://jdjoy.jd.com/api/turncard/channel/sign?` + w({
        turnTableId: 1071,
        fp: getFp(axios, options),
        eid: cookies['3AB9D23F7A4B3C9B'],
        invokeKey: 'yPsq1PHN'
      }),
      method: 'post'
    })
    if (data.success) {
      if (!data.errorCode) {
        console.info('京东内衣馆签到成功')
        if (data.data.hasBean) {
          console.info(data.data.rewardName, data.data.jdBeanQuantity)
          console.reward('京豆', data.data.jdBeanQuantity)
        }
      } else {
        console.error('京东内衣馆签到失败', data.errorMessage)
      }
    } else {
      console.error('京东内衣馆签到失败', data.errorMessage)
    }
  },
  doTask: async (axios, options) => {
    let hasSign = await neiyiguan.detail(axios, options)
    if (!hasSign) {
      await neiyiguan.sign(axios, options)
    } else {
      console.error('今日已签到')
    }
  }
}
module.exports = neiyiguan