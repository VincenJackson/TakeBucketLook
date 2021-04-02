const { w } = require("../sign/common")

var task4 = {
    queryShopsList: async (axios, options) => {
        const { task, token } = options
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": `https://lkyl.dianpusoft.cn`,
                token,
                "referer": `https://lkyl.dianpusoft.cn/client`,
            },
            url: `https://lkyl.dianpusoft.cn/api/ssjj-task-shops/queryShopsList/${task.ssjjTaskInfo.id}?` + w({
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
    followShops: async (axios, options) => {
        const { task, token } = options
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": `https://lkyl.dianpusoft.cn`,
                token,
                "referer": `https://lkyl.dianpusoft.cn/client`,
            },
            url: `https://lkyl.dianpusoft.cn/api/ssjj-task-record/followShops/${task.ssjjTaskInfo.id}?` + w({
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
        let shops = await task4.queryShopsList(axios, options)
        await task4.followShops(axios, options)
        for (let shop of shops) {
            await require('../api/shop').DelShopFav(axios, {
                ...options,
                referer: 'https://shop.m.jd.com/',
                params: {
                    shopId: shop.shopId
                }
            })
            await new Promise((resolve, reject) => setTimeout(resolve, 2 * 1000))
        }
    },
}

module.exports = task4