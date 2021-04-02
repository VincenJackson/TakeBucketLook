const { w, getFp, transParams } = require('../sign/common')
const moment = require('moment')
var piggybank = {
  home: async (axios, options) => {
    let { data } = await axios.request({
      headers: {
        "user-agent": options.userAgent,
        "origin": `https://anmp.jd.com`,
        "referer": `https://anmp.jd.com/babelDiy/Zeus/3eycdtM8eVKR1VqWb2GdxRiHFWmP/index.html`,
      },
      url: `https://anmp.jd.com/babelDiy/Zeus/3eycdtM8eVKR1VqWb2GdxRiHFWmP/index.html`,
      method: 'get'
    })
    let s = data.indexOf('var snsConfig =') + 16
    let e = data.indexOf('var SharePlatforms =')
    return JSON.parse(data.substr(s, e - s))
  },
  query: async (axios, options) => {
    const { activeId, actToken } = options
    let { data } = await axios.request({
      headers: {
        "user-agent": options.userAgent,
        "origin": `https://anmp.jd.com`,
        "referer": `https://anmp.jd.com/babelDiy/Zeus/3eycdtM8eVKR1VqWb2GdxRiHFWmP/index.html`,
      },
      url: `https://wq.jd.com/activet2/piggybank/query?` + w({
        activeid: activeId,
        token: actToken,
        sceneval: 2,
        t: Date.now(),
        _: Date.now(),
      }),
      method: 'post'
    })
    return JSON.parse(data.substr(6).slice(0, -1))
  },
  draw: async (axios, options) => {
    const { activeId, actToken } = options
    let { data } = await axios.request({
      headers: {
        "user-agent": options.userAgent,
        "origin": `https://anmp.jd.com`,
        "referer": `https://anmp.jd.com/babelDiy/Zeus/3eycdtM8eVKR1VqWb2GdxRiHFWmP/index.html`,
      },
      url: `https://wq.jd.com/activet2/piggybank/draw?` + w({
        activeid: activeId,
        token: actToken,
        sceneval: 2,
        t: Date.now(),
        _: Date.now(),
      }),
      method: 'post'
    })
    data = JSON.parse(data.substr(5).slice(0, -1))
    console.info(data.data.prize)
  },
  completeTask: async (axios, options) => {
    const { activeId, actToken, task } = options
    let { data } = await axios.request({
      headers: {
        "user-agent": options.userAgent,
        "origin": `https://anmp.jd.com`,
        "referer": `https://anmp.jd.com/babelDiy/Zeus/3eycdtM8eVKR1VqWb2GdxRiHFWmP/index.html`,
      },
      url: `https://wq.jd.com/activet2/piggybank/completeTask?` + w({
        activeid: activeId,
        token: actToken,
        sceneval: 2,
        t: Date.now(),
        callback: 'completeTaskk',
        task_bless: task.taskRankNum,
        taskid: task._id,
        _: Date.now(),
      }),
      method: 'get'
    })
    let r = JSON.parse(data.substr(14).slice(0, -1))
    console.info(r)
    if (r.errcode === 0) {
      console.info('任务完成成功', r.data.curbless)
    } else {
      console.error('任务完成失败')
    }
  },
  doTask: async (axios, options) => {
    let { name, endTime, activeId, actToken, config: {
      tasks
    } } = await piggybank.home(axios, options)

    if (moment().isAfter(moment(endTime), 'minutes')) {
      console.error('活动已过期', name)
      return
    }

    for (let task of tasks) {
      await piggybank.completeTask(axios, {
        ...options,
        activeId,
        actToken,
        task
      })
      await new Promise((resolve, reject) => setTimeout(resolve, 2 * 1000))
    }
    let res = await piggybank.query(axios, {
      ...options,
      actToken,
      activeId
    })
    let n = Math.floor(res.data.bless / res.data.cost_bless_one_time)
    while (n > 0) {
      await piggybank.draw(axios, {
        ...options,
        actToken,
        activeId
      })
      await new Promise((resolve, reject) => setTimeout(resolve, 2 * 1000))
      n--
    }
  }
}
module.exports = piggybank