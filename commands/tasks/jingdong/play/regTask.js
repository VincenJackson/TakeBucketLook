module.exports = async (scheduler, options, taskOption) => {

  await scheduler.regTask('playTasks', async (request) => {
    await require('./play').completeTasks(request, options)
  }, taskOption)

}