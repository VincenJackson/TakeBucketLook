var browseTask = {
    doTask: async (axios, options) => {
        const { vip_h5, task } = options
        for (let tt of task.taskItems) {
            if (!tt.finish) {
                console.info('开始浏览', tt.title)
                await vip_h5.vvipclub_doTask(axios, {
                    ...options,
                    item: tt
                })
                await new Promise((resolve, reject) => setTimeout(resolve, 1 * 1000))
            } else {
                console.info('已完成', tt.title)
            }
        }
    },
}
module.exports = browseTask