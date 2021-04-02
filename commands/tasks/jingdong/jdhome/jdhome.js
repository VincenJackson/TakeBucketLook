const { w } = require("../sign/common")
const path = require('path')
const fs = require('fs-extra')

// 东东小窝
// https://lkyl.dianpusoft.cn/client/
var jdhome = {
  encrypt: async (axios, options) => {
    let { data } = await axios.request({
      headers: {
        "user-agent": options.userAgent,
        "origin": `https://jdhome.m.jd.com`,
        "referer": `https://jdhome.m.jd.com/dist/taro/index.html`,
      },
      url: `https://jdhome.m.jd.com/saas/framework/encrypt/pin?appId=6d28460967bda11b78e077b66751d2b0`,
      method: 'post'
    })
    return data.data
  },
  login: async (axios, options) => {
    const { userName } = options
    let { data } = await axios.request({
      headers: {
        "user-agent": options.userAgent,
        "origin": `https://lkyl.dianpusoft.cn`,
        "referer": `https://lkyl.dianpusoft.cn/client/`,
        "content-type": "application/json",
        "X-Requested-With": "com.jingdong.app.mall"
      },
      url: `https://lkyl.dianpusoft.cn/api/user-info/login`,
      method: 'post',
      data: {
        "body": {
          "client": 2,
          userName
        }
      }
    })
    return data.head.token
  },
  draw: async (axios, options) => {
    const { token } = options
    let { data } = await axios.request({
      headers: {
        "user-agent": options.userAgent,
        "origin": `https://lkyl.dianpusoft.cn`,
        token,
        "referer": `https://lkyl.dianpusoft.cn/client`,
      },
      url: `https://lkyl.dianpusoft.cn/api/ssjj-draw-record/draw/1318230439454781441?` + w({
        body: '{}'
      }),
      method: 'get'
    })
    if (data.head.code === 200) {
      if (data.body) {
        if ([3].indexOf(data.body.type) !== -1) {
          console.reward('京豆', data.body.prizeNum)
        } else {
          console.info(data.body.name)
        }
      } else {
        console.info(data.head.msg)
      }
    } else {
      console.error(data.head.msg)
    }
  },
  doDrawTask: async (axios, options) => {
    let userName = await jdhome.encrypt(axios, options)
    let token = await jdhome.login(axios, {
      ...options,
      userName
    })
    await jdhome.draw(axios, {
      ...options,
      token
    })
  },
  queryAllTaskInfo: async (axios, options) => {
    const { token } = options
    let { data } = await axios.request({
      headers: {
        "user-agent": options.userAgent,
        "origin": `https://lkyl.dianpusoft.cn`,
        token,
        "referer": `https://lkyl.dianpusoft.cn/client`,
      },
      url: `https://lkyl.dianpusoft.cn/api/ssjj-task-info/queryAllTaskInfo/2?` + w({
        body: '{}'
      }),
      method: 'get'
    })
    if (data.head.code === 200) {
      return data.body
    } else {
      console.error(data.head.msg)
    }
  },
  jdhomeTasks: async (axios, options) => {
    let userName = await jdhome.encrypt(axios, options)
    let token = await jdhome.login(axios, {
      ...options,
      userName
    })
    let willtasks = []
    do {
      let tasks = await jdhome.queryAllTaskInfo(axios, {
        ...options,
        token
      })
      willtasks = tasks.filter(t => t.doneNum < (t.ssjjTaskInfo.awardOfDayNum || 1))
      console.log('剩余任务', willtasks.length)
      for (let task of willtasks) {
        console.info(task.ssjjTaskInfo.name, `${task.doneNum}/${task.ssjjTaskInfo.awardOfDayNum || 1}`)
        if (task.doneNum === 0 && task.ssjjTaskInfo.type !== 1) {
          // 应该是一个bug, 但是可以绕过正常的任务的第1次完成
          await require('./taskType1').doTask(axios, {
            ...options,
            task,
            userName,
            token
          })
        }
        if (fs.existsSync(path.join(__dirname, './taskType' + task.ssjjTaskInfo.type + '.js'))) {
          await require('./taskType' + task.ssjjTaskInfo.type).doTask(axios, {
            ...options,
            task,
            userName,
            token
          })
        } else {
          console.error('未实现的任务', task.ssjjTaskInfo.name, task.ssjjTaskInfo.type, task.ssjjTaskInfo.awardOfDayNum || 1)
        }
      }

      await new Promise((resolve, reject) => setTimeout(resolve, 2 * 1000))
    } while (willtasks.length)
  }
}
module.exports = jdhome