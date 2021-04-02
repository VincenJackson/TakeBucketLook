var task = {
  doTask: async (axios, options) => {
    const { jqworld } = options
    await jqworld.gameTaskStatusUpdate(axios, {
      ...options,
      operateType: 1
    })

    await jqworld.gameTaskStatusUpdate(axios, {
      ...options,
      operateType: 2
    })
  }
}
module.exports = task