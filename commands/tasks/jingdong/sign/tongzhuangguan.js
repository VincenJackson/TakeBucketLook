const { w, getFp } = require('./common')
const { parseCookie } = require('../../../../utils/util')

// 童装馆签到
// https://pro.m.jd.com/mall/active/3Af6mZNcf5m795T8dtDVfDwWVNhJ/index.html
var tongzhuangguan = {
  detail: async (axios, options) => {
    let { data } = await axios.request({
      headers: {
        "user-agent": options.userAgent,
        "origin": "https://pro.m.jd.com",
        "referer": `https://pro.m.jd.com/mall/active/3Af6mZNcf5m795T8dtDVfDwWVNhJ/index.html`,
        "X-Requested-With": "com.jingdong.app.mall"
      },
      url: `https://jdjoy.jd.com/api/turncard/channel/detail?` + w({
        turnTableId: 511,
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
        "referer": `https://pro.m.jd.com/mall/active/3Af6mZNcf5m795T8dtDVfDwWVNhJ/index.html`,
        "X-Requested-With": "com.jingdong.app.mall"
      },
      url: `https://jdjoy.jd.com/api/turncard/channel/sign?` + w({
        turnTableId: 511,
        fp: getFp(axios, options),
        eid: cookies['3AB9D23F7A4B3C9B'],
        invokeKey: 'yPsq1PHN'
      }),
      method: 'post'
    })
    if (data.success) {
      if (!data.errorCode) {
        console.info('童装馆签到成功')
        if (data.data.hasBean) {
          console.info(data.data.rewardName, data.data.jdBeanQuantity)
          console.reward('京豆', data.data.jdBeanQuantity)
        }
      } else {
        console.error('童装馆签到失败', data.errorMessage)
      }
    } else {
      console.error('童装馆签到失败', data.errorMessage)
    }
  },
  doTask: async (axios, options) => {
    let hasSign = await tongzhuangguan.detail(axios, options)
    if (!hasSign) {
      await tongzhuangguan.sign(axios, options)
    } else {
      console.error('今日已签到')
    }
  }
}
module.exports = tongzhuangguan