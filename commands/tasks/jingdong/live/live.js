const { w } = require('../sign/common')
// https://lives.jd.com/#/3749132?origin=2&appid=jdzb
var live = {
  liveChannelTaskListToM: async (axios, options) => {
    let { data } = await axios.request({
      headers: {
        "user-agent": options.userAgent,
        "origin": "https://cfe.m.jd.com",
        "referer": ' https://cfe.m.jd.com/privatedomain/live-boborock/20210305/index.html',
        "X-Requested-With": "com.jingdong.app.mall"
      },
      url: `https://api.m.jd.com/api?` + w({
        functionId: 'liveChannelTaskListToM',
        appid: 'h5-live',
        body: JSON.stringify({
          "lng": "",
          "lat": "",
          "sid": "",
          "un_area": "",
          "timestamp": Date.now()
        }),
        v: Date.now()
        // eu: '8363734343230333530323536353', // see options.userAgent
        // fv: '53D2130343430303733373432666' // see options.userAgent
      }),
      method: 'get'
    })
    if (data.code === '0') {
      console.info('获取任务状态成功')
      return {
        tasks: data.data.task,
        sign: data.data.sign,
        starLiveList: data.data.starLiveList
      }
    } else {
      console.error('获取任务状态失败', data)
      return {}
    }
  },
  sign: async (axios, options) => {
    await live.getChannelTaskRewardToM(axios, {
      ...options,
      type: 'signTask',
      extra: { "itemId": "1" }
    })
  },
  getChannelTaskRewardToM: async (axios, options) => {
    const { type, extra } = options
    let { data } = await axios.request({
      headers: {
        "user-agent": options.userAgent,
        "origin": "https://cfe.m.jd.com",
        "referer": 'https://cfe.m.jd.com/privatedomain/live-boborock/20210305/index.html',
        "X-Requested-With": "com.jingdong.app.mall"
      },
      url: `https://api.m.jd.com/api?` + w({
        functionId: 'getChannelTaskRewardToM',
        appid: 'h5-live',
        body: JSON.stringify({ "type": type, ...extra }),
        v: Date.now()
      }),
      method: 'get'
    })
    if (data.code === '0') {
      if (data.subCode === '0') {
        console.reward('京豆', data.sum)
      } else {
        console.info(data.msg)
      }
    } else {
      console.error('领取奖励失败', data)
    }
  },
  doTask: async (axios, options) => {
    //1 未开始， 2未领取，3已完成
    let { tasks: tasks1, starLiveList: starLiveList1 } = await live.liveChannelTaskListToM(axios, options)
    let willtaks = [...tasks1, ...(starLiveList1 || [])].filter(t => t.state === 1)
    console.info('剩余未开始任务', willtaks.length)
    for (let task of willtaks) {
      console.log(task.title, task.type, task.state)
      await require('./' + task.type).doTask(axios, {
        ...options,
        liveId: task.extra.liveId
      })
      await new Promise((resolve, reject) => setTimeout(resolve, 1 * 1000))
    }

    let { tasks: tasks2, starLiveList: starLiveList2 } = await live.liveChannelTaskListToM(axios, options)
    willtaks = [...tasks2, ...(starLiveList2 || [])].filter(t => t.state === 2)
    console.info('剩余未领取任务', willtaks.length)
    for (let task of willtaks) {
      console.log(task.title, task.type, task.state)
      await live.getChannelTaskRewardToM(axios, {
        ...options,
        type: task.type,
        extra: task.extra
      })
      await new Promise((resolve, reject) => setTimeout(resolve, 1 * 1000))
    }

  },
  doSign: async (axios, options) => {
    let { sign } = await live.liveChannelTaskListToM(axios, options)
    if (sign.list.find(s => s.day === sign.today)?.state === 0) {
      console.error('今日已签到')
      return
    }
    await live.sign(axios, options)
  }
}
module.exports = live
