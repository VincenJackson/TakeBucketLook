const { reqApi } = require('./common')
var luckdraw = {
    queryActivityBaseInfo: async (axios, options) => {
        let { data } = await reqApi(axios, {
            ...options,
            url: `https://lop-proxy.jd.com/luckdraw/queryActivityBaseInfo`,
            data: [{ "userNo": "$cooMrdGatewayUid$", "activityCode": "1376458710959783936" }]
        })
        return data.content
    },
    draw: async (axios, options) => {
        let { data } = await reqApi(axios, {
            ...options,
            url: `https://lop-proxy.jd.com/luckdraw/draw`,
            data: [{ "userNo": "$cooMrdGatewayUid$", "activityCode": "1376458710959783936" }]
        })
        if (data.content?.rewardDTO?.rewardId) {
            console.info('获得', data.content?.rewardDTO?.title)
        }
    },
    queryMissionList: async (axios, options) => {
        let { data } = await reqApi(axios, {
            ...options,
            url: `https://lop-proxy.jd.com/luckdraw/queryMissionList`,
            data: [{ "userNo": "$cooMrdGatewayUid$", "activityCode": "1376458710959783936" }]
        })
        if (data.success) {
            return data.content.missionList || []
        } else {
            console.error(data.errorMsg)
        }
    },
    completeMission: async (axios, options) => {
        let { task } = options
        let { data } = await reqApi(axios, {
            ...options,
            url: `https://lop-proxy.jd.com/luckdraw/completeMission`,
            data: [{ "userNo": "$cooMrdGatewayUid$", "activityCode": "1376458710959783936", "missionNo": task.missionNo, params: task.params }]
        })
        console.log(data)
    },
    getDrawChance: async (axios, options) => {
        const { task } = options
        let { data } = await reqApi(axios, {
            ...options,
            url: `https://lop-proxy.jd.com/luckdraw/getDrawChance`,
            data: [{ "activityCode": "1376458710959783936", "userNo": "$cooMrdGatewayUid$", "getCode": task.getRewardNos[0] }]
        })
        if (data?.content) {
            console.info('领取抽奖机会1次')
        } else {
            console.error('领取抽奖机会失败')
        }
    },
    doTask: async (axios, options) => {
        let tasks = await luckdraw.queryMissionList(axios, options)
        let willtasks = tasks.filter(t => t.status === 1)
        for (let task of willtasks) {
            console.info(task.jumpType, task.title, task.totalNum)
            if ([130, 11].indexOf(task.jumpType) !== -1) {
                await luckdraw.completeMission(axios, {
                    ...options,
                    task
                })
            } else if ([135].indexOf(task.jumpType) !== -1) {
                await luckdraw.completeMission(axios, {
                    ...options,
                    task: {
                        ...task,
                        params: JSON.stringify({
                            "subTitle": "京豆红包免费领，并得1次抽奖机会",
                            "rank": "1",
                            "endTime": "2021-04-01 00:00:00",
                            "url": "https://funearth.m.jd.com/babelDiy/Zeus/3BB1rymVZUo4XmicATEUSDUgHZND/index.html?source=78"
                        })
                    }
                })
            } else {
                console.error('未实现的任务')
            }
            await new Promise((resolve, reject) => setTimeout(resolve, 2 * 1000))
        }


        tasks = await luckdraw.queryMissionList(axios, options)
        willtasks = tasks.filter(t => t.status === 11)
        for (let task of willtasks) {
            await luckdraw.getDrawChance(axios, {
                ...options,
                task
            })
            await new Promise((resolve, reject) => setTimeout(resolve, 1 * 1000))
        }

        let { drawNum } = await luckdraw.queryActivityBaseInfo(axios, options)
        console.info('剩余抽奖次数', drawNum)
        while (drawNum > 0) {
            await luckdraw.draw(axios, options)
            await new Promise((resolve, reject) => setTimeout(resolve, 1 * 1000))
            drawNum--
        }
    }
}
module.exports = luckdraw