const { reqApiSign } = require('../api/client')
const path = require('path')
const fs = require('fs-extra')

var jqworld = {
  gameTaskStatusUpdate: async (axios, options) => {
    const { task, operateType } = options
    let data = await reqApiSign(axios, {
      ...options,
      functionId: 'gameTaskStatusUpdate',
      body: { "category": task.category, operateType, "taskId": task.taskId, "version": "1.4" }
    })
    if (data.isSucc) {
      console.log('任务完成')
    } else {
      console.error(data.message)
    }
  },
  gameTaskList: async (axios, options) => {
    let data = await reqApiSign(axios, {
      ...options,
      functionId: 'gameTaskList',
      body: { "source": 1, "version": "1.4" }
    })
    return data.taskList
  },
  completeTasks: async (axios, options) => {
    let tasks = await jqworld.gameTaskList(axios, options)
    let willtask = (tasks || []).filter(t => t.status !== 3)
    console.info('剩余未完成任务', willtask.length)
    for (let task of willtask) {
      console.info(task.taskId, task.title)
      if (fs.existsSync(path.join(__dirname, './taskType' + task.taskId + '.js'))) {
        await require('./taskType' + task.taskId).doTask(axios, {
          ...options,
          task,
          jqworld
        })
      } else {
        console.error('未实现的任务', task.taskId, task.title)
      }
    }
  }
}
module.exports = jqworld