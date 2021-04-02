const { transParams, getFp } = require('../sign/common')
const { parseCookie } = require('../../../../utils/util')
const path = require('path')
const fs = require('fs-extra')
var jinrong = {
  querySignedStatus: async (axios, options) => {
    let { data } = await axios.request({
      headers: {
        "user-agent": options.userAgent,
        "origin": "https://member.jr.jd.com",
        "referer": 'https://member.jr.jd.com/activities/sign/v5/indexV2.html?channelLv=icon&jrcontainer=h5&jrlogin=true'
      },
      url: `https://ms.jr.jd.com/gw/generic/hyqy/h5/m/querySignedStatus?_=` + Date.now(),
      method: 'post',
      data: transParams({
        reqData: JSON.stringify({ "channelLv": "icon" })
      })
    })
    if (data.resultCode === 0) {
      console.info('查询签到状态成功')
      return data.resultData.result.signedStatus
    } else {
      console.error('查询签到状态失败', data)
    }
  },
  queryProcessStatus: async (axios, options) => {
    const { reqData } = options
    let { data } = await axios.request({
      headers: {
        "user-agent": options.userAgent,
        "origin": "https://member.jr.jd.com",
        "referer": 'https://member.jr.jd.com/activities/sign/v5/indexV2.html?channelLv=icon&jrcontainer=h5&jrlogin=true'
      },
      url: `https://nu.jr.jd.com/gw/generic/jrm/h5/m/process?_=` + Date.now(),
      method: 'post',
      data: transParams({
        reqData: JSON.stringify(reqData)
      })
    })
    if (data.resultCode === 0) {
      console.info(data.resultData.data)
      console.info('查询签到状态成功', data.resultData.data.businessCode, data.resultData.data.businessMsg)
      return data.resultData.data
    } else {
      console.error('查询签到状态失败', data)
    }
  },
  steelSignin: async (axios, options) => {
    let { data } = await axios.request({
      headers: {
        "user-agent": options.userAgent,
        "origin": "https://member.jr.jd.com",
        "referer": 'https://member.jr.jd.com/activities/sign/v5/indexV2.html?channelLv=icon&jrcontainer=h5&jrlogin=true'
      },
      url: `https://ms.jr.jd.com/gw/generic/hy/h5/m/signIn1?_=` + Date.now(),
      method: 'post',
      data: transParams({
        reqData: JSON.stringify({ "channelSource": "JRAPP6.0", "riskDeviceParam": "{}" })
      })
    })
    if (data.resultData.resBusiCode === 0) {
      console.info('钢镚签到成功')
      if (data.resultData.resBusiData?.baseReward) {
        console.reward('钢镚', data.resultData.resBusiData?.baseReward)
      } else {
        console.info(data.resultData.resBusiData)
      }
    } else {
      console.error('钢镚签到失败', data.resultData.resBusiMsg)
    }
  },
  // https://m.jr.jd.com/vip/sign/html/index.html
  signin: async (axios, options) => {
    let signedStatus = await jinrong.querySignedStatus(axios, options)
    if (!signedStatus) {
      console.error('未实现的任务')
    }
  },
  // https://m.jr.jd.com/integrate/signincash/index.html
  DoubleSignin_xianjin: async (axios, options) => {
    let { businessData } = await jinrong.queryProcessStatus(axios, {
      ...options,
      reqData: {
        "actCode": "F68B2C3E71",
        "type": 9,
        "frontParam": { "channel": "JR", "belong": "xianjin" }
      }
    })
    if (!businessData.signInJr) {
      console.log('开始完成京东金融APP签到')
      await jinrong.signin(axios, options)
    }
    if (!businessData.signInJd) {
      console.log('开始完成京东APP签到')
      await require('../sign/signCalendar').doTask(axios, options)
    }
    if (!businessData.get) {
      let { businessData } = await jinrong.queryProcessStatus(axios, {
        ...options,
        reqData: {
          "actCode": "F68B2C3E71",
          "type": 12,
          "frontParam": { "belong": "xianjin" }
        }
      })
      businessData?.awardList.forEach(r => {
        console.info(r.name, r.type)
        if (r.type === 24) {
          console.reward('现金红包', Number(r.count * 0.01).toFixed(2))
        }
      })
    }
  },
  DoubleSignin_jindou: async (axios, options) => {
    let { businessData } = await jinrong.queryProcessStatus(axios, {
      ...options,
      reqData: {
        "actCode": "F68B2C3E71",
        "type": 9,
        "frontParam": { "channel": "JR", "belong": "jingdou" }
      }
    })
    if (!businessData.signInJr) {
      console.info('开始完成京东金融APP签到')
      await jinrong.signin(axios, options)
    }
    if (!businessData.signInJd) {
      console.info('开始完成京东APP签到')
      await require('../sign/signCalendar').doTask(axios, options)
    }
    if (!businessData.get) {
      await jinrong.queryProcessStatus(axios, {
        ...options,
        reqData: {
          "actCode": "F68B2C3E71",
          "type": 9,
          "frontParam": { "channel": "JR", "belong": "jingdou" }
        }
      })
      await new Promise((resolve, reject) => setTimeout(resolve, 1 * 1000))

      let cookies = parseCookie(options.cookies, ['3AB9D23F7A4B3C9B'])
      await jinrong.queryProcessStatus(axios, {
        ...options,
        reqData: {
          "actCode": "F68B2C3E71",
          "type": 4,
          "frontParam": { "belong": "jingdou" },
          "riskDeviceParam": JSON.stringify({
            "fp": getFp(axios, options),
            "eid": cookies['3AB9D23F7A4B3C9B'],
            "sdkToken": "",
            "sid": ""
          })
        }
      })

      await new Promise((resolve, reject) => setTimeout(resolve, 1 * 1000))
      let { businessData } = await jinrong.queryProcessStatus(axios, {
        ...options,
        reqData: {
          "actCode": "F68B2C3E71",
          "type": 12,
          "frontParam": { "belong": "jingdou" }
        }
      })
      businessData?.awardList.forEach(r => {
        if (r.type == 1) {
          console.reward('京豆', r.count)
        } else {
          console.info(r.name, r.type, r.count)
        }
      })
      businessData?.awardListVo.forEach(r => {
        console.info(r)
      })
    }
  },
  DoubleSignin_jintie: async (axios, options) => {
    await require('../JinTie/JinTie').doSign(axios, options)
    let cookies = parseCookie(options.cookies, ['3AB9D23F7A4B3C9B'])
    let { businessData } = await jinrong.queryProcessStatus(axios, {
      ...options,
      reqData: {
        "type": 3,
        "frontParam": { "channel": "JD", "belong": 4 },
        "actCode": "1DF13833F7",
        "channel": "sqcs",
        "riskDeviceParam": JSON.stringify({
          appId: "jdapp",
          appType: "3",
          clientVersion: "9.4.6",
          deviceType: "VKY-AL00",
          "eid": cookies['3AB9D23F7A4B3C9B'],
          "fp": getFp(axios, options),
          idfa: "",
          imei: "",
          ip: "117.189.12.112",
          macAddress: "",
          networkType: "WIFI",
          os: "android",
          osVersion: "9",
          token: "",
          uuid: ""
        })
      }
    })
  },
  Signin1: async (axios, options) => {
    let { businessData } = await jinrong.queryProcessStatus(axios, {
      ...options,
      reqData: {
        "actCode": "3A3E839252",
        "type": 3
      }
    })
    if (businessData.pickStatus === 2) {
      businessData.rewards.forEach(r => {
        console.info('预计获得', 'rewardType:' + businessData.rewardType, r.rewardName, r.rewardPrice)
      })
      let { businessCode } = await jinrong.queryProcessStatus(axios, {
        ...options,
        reqData: {
          "actCode": "3A3E839252",
          "type": 4
        }
      })
      if (businessCode === '200') {
        businessData.rewards.forEach(r => {
          console.reward(r.rewardName, r.rewardPrice)
        })
      }
    }
  },
  Signin2: async (axios, options) => {
    let { businessData } = await jinrong.queryProcessStatus(axios, {
      ...options,
      reqData: {
        "actCode": "69F5EC743C",
        "type": 3
      }
    })

    if (businessData.pickStatus === 2) {
      businessData.rewards.forEach(r => {
        console.info('预计获得', 'rewardType:' + businessData.rewardType, r.rewardName, r.rewardPrice)
      })
      let { businessCode } = await jinrong.queryProcessStatus(axios, {
        ...options,
        reqData: {
          "actCode": "69F5EC743C",
          "type": 4
        }
      })
      if (businessCode === '200') {
        businessData.rewards.forEach(r => {
          console.reward(r.rewardName, r.rewardPrice)
        })
      }
    }
  },
  Signin3: async (axios, options) => {
    let { businessData } = await jinrong.queryProcessStatus(axios, {
      ...options,
      reqData: {
        "actCode": "30C4F86264",
        "type": 3
      }
    })
    if (businessData.pickStatus === 2) {
      businessData.rewards.forEach(r => {
        console.info('预计获得', 'rewardType:' + businessData.rewardType, r.rewardName, r.rewardPrice)
      })
      let { businessCode } = await jinrong.queryProcessStatus(axios, {
        ...options,
        reqData: {
          "actCode": "30C4F86264",
          "type": 4
        }
      })
      if (businessCode === '200') {
        businessData.rewards.forEach(r => {
          console.reward(r.rewardName, r.rewardPrice)
        })
      }
    }
  },
  Signin4: async (axios, options) => {
    let { businessData } = await jinrong.queryProcessStatus(axios, {
      ...options,
      reqData: {
        "actCode": "1D06AA3B0F",
        "type": 3
      }
    })
    if (businessData.pickStatus === 2) {
      businessData.rewards.forEach(r => {
        console.info('预计获得', 'rewardType:' + businessData.rewardType, r.rewardName, r.rewardPrice)
      })
      let { businessCode } = await jinrong.queryProcessStatus(axios, {
        ...options,
        reqData: {
          "actCode": "1D06AA3B0F",
          "type": 4
        }
      })
      if (businessCode === '200') {
        businessData.rewards.forEach(r => {
          console.reward(r.rewardName, r.rewardPrice)
        })
      }
    }
  },
  Signin5: async (axios, options) => {
    let { businessData } = await jinrong.queryProcessStatus(axios, {
      ...options,
      reqData: {
        "actCode": "4D25A6F482",
        "type": 3
      }
    })
    if (businessData.pickStatus === 2) {
      businessData.rewards.forEach(r => {
        console.info('预计获得', 'rewardType:' + businessData.rewardType, r.rewardName, r.rewardPrice)
      })
      let { businessCode } = await jinrong.queryProcessStatus(axios, {
        ...options,
        reqData: {
          "actCode": "4D25A6F482",
          "type": 4
        }
      })
      if (businessCode === '200') {
        businessData.rewards.forEach(r => {
          console.reward(r.rewardName, r.rewardPrice)
        })
      }
    }
  }
}
module.exports = jinrong