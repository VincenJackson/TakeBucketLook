const { reqApi } = require('../api/api')
const { reqApiSign } = require('../api/client')
const { parseCookie } = require('../../../../utils/util')

const moment = require('moment')
var couponnecklace = {
  cc_sign: async (axios, options) => {

    let cookies = parseCookie(options.cookies, ['shshshfpb', '3AB9D23F7A4B3C9B'])
    let data = await reqApiSign(axios, {
      ...options,
      functionId: 'ccSignInNew',
      body: {
        "childActivityUrl": "openapp.jdmobile://virtual?params={\"category\":\"jump\",\"des\":\"couponCenter\"}",
        "eid": cookies['3AB9D23F7A4B3C9B'],
        "monitorRefer": "appClient",
        "monitorSource": "cc_sign_android_index_config",
        "pageClickKey": "Coupons_GetCenter",
        "pin": "c87d487af7c7c6195336de6974ea90d9f14e6e2d56b095b4a4043116808c1b08",
        "sessionId": "",
        "shshshfpb": cookies.shshshfpb,
        "verifyToken": ""
      }
    })
    if (data?.busiCode === '0') {
      console.info('签到成功', data)
    } else {
      console.error('签到失败', data)
    }
  },
  necklace_homePage: async (axios, options) => {
    let { data } = await reqApi(axios, {
      ...options,
      functionId: "necklace_homePage",
      appid: "coupon-necklace",
      headers: {
        Referer: "https://h5.m.jd.com/babelDiy/Zeus/41Lkp7DumXYCFmPYtU3LTcnTTXTX/index.html?babelChannel=ttt1"
      },
      params: {
        loginType: 2,
        client: "coupon-necklace"
      }
    })
    return data.result
  },
  necklace_sign: async (axios, options) => {
    let { data } = await reqApi(axios, {
      ...options,
      functionId: "necklace_sign",
      appid: "coupon-necklace",
      headers: {
        Referer: "https://h5.m.jd.com/babelDiy/Zeus/41Lkp7DumXYCFmPYtU3LTcnTTXTX/index.html?babelChannel=ttt1"
      },
      params: {
        loginType: 2,
        client: "coupon-necklace"
      }
    })
    if (data?.biz_code === 0) {
      console.info('签到成功', '累计点点券', data?.result?.totalScoreNum)
    } else {
      console.error('签到失败', data)
    }
  },
  necklace_getTask: async (axios, options) => {
    const { task } = options
    let { data } = await reqApi(axios, {
      ...options,
      functionId: "necklace_getTask",
      appid: "coupon-necklace",
      body: {
        "taskId": task.id,
        "currentDate": encodeURIComponent(moment().toISOString())
      },
      headers: {
        Referer: "https://h5.m.jd.com/babelDiy/Zeus/41Lkp7DumXYCFmPYtU3LTcnTTXTX/index.html?babelChannel=ttt1"
      },
      params: {
        loginType: 2,
        client: "coupon-necklace"
      }
    })
    return data.result
  },
  necklace_chargeScores: async (axios, options) => {
    const { body } = options
    let { data } = await reqApi(axios, {
      ...options,
      functionId: "necklace_chargeScores",
      appid: "coupon-necklace",
      body: {
        "currentDate": encodeURIComponent(moment().toISOString()),
        ...body
      },
      headers: {
        Referer: "https://h5.m.jd.com/babelDiy/Zeus/41Lkp7DumXYCFmPYtU3LTcnTTXTX/index.html?babelChannel=ttt1"
      },
      params: {
        loginType: 2,
        client: "coupon-necklace"
      }
    })
    if (data?.biz_code === 0) {
      console.info('领取', data?.result?.giftScoreNum)
    } else {
      console.error('领取奖励失败', data)
    }
  },
  necklace_reportTask: async (axios, options) => {
    const { body } = options
    let data = await reqApi(axios, {
      ...options,
      functionId: "necklace_reportTask",
      appid: "coupon-necklace",
      body: {
        "currentDate": encodeURIComponent(moment().toISOString()),
        ...body
      },
      headers: {
        Referer: "https://h5.m.jd.com/babelDiy/Zeus/41Lkp7DumXYCFmPYtU3LTcnTTXTX/index.html?babelChannel=ttt1"
      },
      params: {
        loginType: 2,
        client: "coupon-necklace"
      }
    })
    console.log(data)
  },
  necklace_startTask: async (axios, options) => {
    const { task } = options
    let { data } = await reqApi(axios, {
      ...options,
      functionId: "necklace_startTask",
      appid: "coupon-necklace",
      body: {
        "taskId": task.id,
        "currentDate": encodeURIComponent(moment().toISOString())
      },
      headers: {
        Referer: "https://h5.m.jd.com/babelDiy/Zeus/41Lkp7DumXYCFmPYtU3LTcnTTXTX/index.html?babelChannel=ttt1"
      },
      params: {
        loginType: 2,
        client: "coupon-necklace"
      }
    })
    if (data?.biz_code === 0) {
      console.info('任务领取成功')
    } else {
      console.error('任务领取失败', data)
    }
  },
  doTask: async (axios, options) => {
    let { taskConfigVos: tasks, totalScore } = await couponnecklace.necklace_homePage(axios, options)
    console.info('已有点点券', totalScore)
    let willtask = tasks.filter(t => t.taskStage === 0)
    for (let task of willtask) {
      console.info(task.taskType, task.taskName)
      await couponnecklace.necklace_startTask(axios, {
        ...options,
        task
      })
      await new Promise((resolve, reject) => setTimeout(resolve, 1 * 1000))
    }

    let { taskConfigVos: tasks1 } = await couponnecklace.necklace_homePage(axios, options)
    willtask = tasks1.filter(t => t.taskStage === 1)
    for (let task of willtask) {
      console.info(task.taskType, task.taskName)
      if (task.taskType === 6) {
        let tt = await couponnecklace.necklace_getTask(axios, {
          ...options,
          task
        })
        for (let t of tt.taskItems) {
          await couponnecklace.necklace_reportTask(axios, {
            ...options,
            body: {
              taskId: task.id,
              itemId: t.id
            }
          })
          await new Promise((resolve, reject) => setTimeout(resolve, 1 * 1000))
        }
      } else {
        await couponnecklace.necklace_reportTask(axios, {
          ...options,
          body: {
            taskId: task.id
          }
        })
        await new Promise((resolve, reject) => setTimeout(resolve, 1 * 1000))
      }
    }

    let { bubbles } = await couponnecklace.necklace_homePage(axios, options)
    for (let task of bubbles) {
      console.info(task.bubbleType, task.bubbleName)
      await couponnecklace.necklace_chargeScores(axios, {
        ...options,
        body: {
          bubleId: task.id
        }
      })
      await new Promise((resolve, reject) => setTimeout(resolve, 1 * 1000))
    }
  }
}
module.exports = couponnecklace