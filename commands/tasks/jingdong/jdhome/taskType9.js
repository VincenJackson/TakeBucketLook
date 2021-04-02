const { w } = require("../sign/common")

var task4 = {
    queryGoodsList: async (axios, options) => {
        const { task, token } = options
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": `https://lkyl.dianpusoft.cn`,
                token,
                "referer": `https://lkyl.dianpusoft.cn/client`,
            },
            url: `https://lkyl.dianpusoft.cn/api/ssjj-task-commodities/queryCommoditiesListByTaskId/${task.ssjjTaskInfo.id}?` + w({
                body: '{}'
            }),
            method: 'get'
        })
        if (data.head.code === 200) {
            return data.body
        } else {
            console.error(data.head.msg)
        }
    },
    purchaseCommodities: async (axios, options) => {
        const { task, token } = options
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": `https://lkyl.dianpusoft.cn`,
                token,
                "referer": `https://lkyl.dianpusoft.cn/client`,
            },
            url: `https://lkyl.dianpusoft.cn/api/ssjj-task-record/purchaseCommodities/${task.ssjjTaskInfo.id}?` + w({
                body: '{}'
            }),
            method: 'get'
        })
        if (data.head.code === 200) {
            console.info(data)
        } else {
            console.error(data.head.msg)
        }
    },
    doTask: async (axios, options) => {
        console.error('该任务为一键加购商品任务，暂未提供去除加购的商品')
        let goods = await task4.queryGoodsList(axios, options)
        await task4.purchaseCommodities(axios, options)
        // for (let good of goods) {
        //     await require('../api/cart').DelGoods(axios, {
        //         ...options,
        //         referer: 'https://shop.m.jd.com/',
        //         params: {
        //             sku: good.sku
        //         }
        //     })
        //     await new Promise((resolve, reject) => setTimeout(resolve, 2 * 1000))
        // }
    },
}

module.exports = task4