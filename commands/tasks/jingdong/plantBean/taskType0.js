const { reqApiNoSign } = require('../api/client')
// 逛一逛
var task = {
    doTask: async (axios, options) => {
        const { task } = options
        console.log(task.taskType, task.desc)
        let data = await reqApiNoSign(axios, {
            ...options,
            functionId: 'receiveNutrientsTask',
            method: 'get',
            body: {
                "awardType": task.taskType + '',
                "monitor_refer": "plant_receiveNutrientsTask",
                "monitor_source": "plant_app_plant_index",
                "version": "9.2.4.0"
            }
        })
        if (data.code === '0') {
            if (!data.errorCode) {
                console.info('领取营养液成功', data.data.nutrNum)
                return true
            } else {
                console.error('领取营养液失败', data.errorMessage)
            }
        } else {
            console.error('领取营养液失败', data)
        }
    },
}

module.exports = task