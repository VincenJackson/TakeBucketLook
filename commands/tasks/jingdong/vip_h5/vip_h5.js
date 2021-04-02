const { reqApi } = require('./common')
var vip_h5 = {
    vvipclub_lotteryTask: async (axios, options) => {
        let { data } = await reqApi(axios, {
            ...options,
            appid: 'vip_h5',
            functionId: 'vvipclub_lotteryTask',
            body: { "info": "browseTask", "withItem": true }
        })
        return data.data || []
    },
    vvipclub_shaking: async (axios, options) => {
        let { data } = await reqApi(axios, {
            ...options,
            appid: 'vip_h5',
            functionId: 'vvipclub_shaking',
            body: {}
        })
        if (data.success) {
            console.info('摇一摇签到成功')
            if (data.data?.prizeBean?.count) {
                console.reward('京豆', data.data?.prizeBean?.count)
            }
        } else {
            console.error('摇一摇签到失败', data)
        }
    },
    pg_channel_sign: async (axios, options) => {
        let { floorInfoList } = await vip_h5.pg_channel_page_data(axios, options)
        let fl = floorInfoList.find(f => f.code === 'SIGN_ACT_INFO')
        await vip_h5.pg_interact_interface_invoke(axios, {
            ...options,
            currSignCursor: fl.floorData.signActInfo.currSignCursor,
            floorToken: fl.token
        })
    },
    pg_channel_page_data: async (axios, options) => {
        let { data } = await reqApi(axios, {
            ...options,
            appid: 'sharkBean',
            functionId: 'pg_channel_page_data',
            body: { "paramData": { "token": "dd2fb032-9fa3-493b-8cd0-0d57cd51812d" } }
        })
        return data.data
    },
    pg_interact_interface_invoke: async (axios, options) => {
        const { floorToken, currSignCursor } = options
        let { data } = await reqApi(axios, {
            ...options,
            appid: 'sharkBean',
            functionId: 'pg_interact_interface_invoke',
            body: {
                "floorToken": floorToken,
                "dataSourceCode": "signIn",
                "argMap": { currSignCursor }
            }
        })
        if (data.success) {
            if (data?.rewardVos) {
                data?.rewardVos.map(r => {
                    if (r?.jingBeanVo.beanNum) {
                        console.reward('京豆', r?.jingBeanVo.beanNum)
                    } else {
                        console.info(data)
                    }
                })
            } else {
                console.info(data)
            }
        } else {
            console.error(data.message)
        }
    },
    vvipclub_doTask: async (axios, options) => {
        const { item } = options
        let { data } = await reqApi(axios, {
            ...options,
            appid: 'vip_h5',
            functionId: 'vvipclub_doTask',
            body: { "taskName": "browseTask", "taskItemId": item.id }
        })
        if (data.data.isFinish) {
            console.info('任务完成成功')
        } else {
            console.error('任务完成失败', data)
        }
    },
    vvipclub_shaking_lottery: async (axios, options) => {
        let { data } = await reqApi(axios, {
            ...options,
            appid: 'sharkBean',
            functionId: 'vvipclub_shaking_lottery',
            body: {}
        })
        if (data.success) {
            console.info('摇京豆成功', `京豆+${data.data.rewardBeanAmount || 0}`, `剩余机会+${data.data.remainLotteryTimes || 0}`)
            console.reward('京豆', data.data.rewardBeanAmount || 0)
            if (data?.data?.couponInfo?.couponId) {
                console.log('获得优惠券', data?.data?.couponInfo?.limitStr)
            }
            return data.data.remainLotteryTimes || 0
        } else {
            console.error('摇京豆失败', data.echo || data.resultTips)
        }
    },
    sharkBean: async (axios, options) => {
        let tasks = await vip_h5.vvipclub_lotteryTask(axios, options)
        for (let task of tasks) {
            console.info(task.taskName)
            require('./' + task.taskName).doTask(axios, {
                ...options,
                task,
                vip_h5
            })
            await new Promise((resolve, reject) => setTimeout(resolve, 1 * 1000))
        }
        let num = 0
        do {
            num = await vip_h5.vvipclub_shaking_lottery(axios, options)
            await new Promise((resolve, reject) => setTimeout(resolve, 1 * 1000))
            if (!num) {
                break
            }
        } while (num > 0)
    }
}
module.exports = vip_h5