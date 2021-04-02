const { reqApiNoSign } = require('../api/client')

var turntable = {
    wheelSurfIndex: async (axios, options) => {
        let data = await reqApiNoSign(axios, {
            ...options,
            functionId: 'wheelSurfIndex',
            body: { "actId": "jgpqtzjhvaoym", "appSource": "jdhome" },
            method: 'get',
            headers: {
                referer: 'https://turntable.m.jd.com/?actId=jgpqtzjhvaoym&appSource=jdhome'
            }
        })
        return data.data
    },
    lotteryDraw: async (axios, options) => {
        const { lotteryCode } = options
        let data = await reqApiNoSign(axios, {
            ...options,
            functionId: 'lotteryDraw',
            body: {
                "actId": "jgpqtzjhvaoym",
                "appSource": "jdhome",
                "lotteryCode": lotteryCode
            },
            method: 'get',
            headers: {
                referer: 'https://turntable.m.jd.com/?actId=jgpqtzjhvaoym&appSource=jdhome'
            }
        })
        console.info(data)
    },
    doTask: async (axios, options) => {
        let { lotteryCode, lotteryCount } = await turntable.wheelSurfIndex(axios, options)
        console.info('剩余抽奖次数', lotteryCount)
        while (lotteryCount > 0) {
            await turntable.lotteryDraw(axios, { ...options, lotteryCode })
            await new Promise((resolve, reject) => setTimeout(resolve, 3 * 1000))
            lotteryCount--
        }
    }
}
module.exports = turntable