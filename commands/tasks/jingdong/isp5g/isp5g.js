const { transParams, w } = require('../sign/common')
var isp5g = {
    coin: async (axios, options) => {
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "referer": `https://isp5g.m.jd.com/`,
            },
            url: `https://isp5g.m.jd.com/active/coin?` + w({
                t: Date.now()
            }),
            method: 'get'
        })
        console.info(`已有${data.data.total}信号量, 待收取${data.data.now}`)
        if (data.data.total >= 2000) {
            await isp5g.lottery(axios, options)
        }
        return data.data
    },
    risk: async (axios, options) => {
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "referer": `https://isp5g.m.jd.com/`,
            },
            url: `https://isp5g.m.jd.com/active/risk?` + w({
                t: Date.now()
            }),
            method: 'get'
        })
        console.log(data)
    },
    getCoin: async (axios, options) => {
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "referer": `https://isp5g.m.jd.com/`,
            },
            url: `https://isp5g.m.jd.com/active/getCoin?` + w({
                t: Date.now()
            }),
            method: 'get'
        })
        console.info('获得信号量', data.data)
    },
    conf: async (axios, options) => {
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "referer": `https://isp5g.m.jd.com/`,
            },
            url: `https://isp5g.m.jd.com/active/conf?` + w({
                t: Date.now()
            }),
            method: 'get'
        })
        return data.data
    },
    homeGoBrowse: async (axios, options) => {
        const { task, type } = options
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "referer": `https://isp5g.m.jd.com/`,
            },
            url: `https://isp5g.m.jd.com/active/homeGoBrowse?` + w({
                t: Date.now(),
                type: type,
                id: task.id,
            }),
            method: 'get'
        })
        console.log(data)
    },
    lottery: async (axios, options) => {
        console.info('开始抽奖')
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "referer": `https://isp5g.m.jd.com/`,
            },
            url: `https://isp5g.m.jd.com/prize/lottery?` + w({
                t: Date.now()
            }),
            method: 'get'
        })
        console.info(data.data)
        if (data?.data?.beanNum) {
            console.reward('京豆', data?.data?.beanNum)
        }
    },
    taskList: async (axios, options) => {
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "referer": `https://isp5g.m.jd.com/`,
            },
            url: `https://isp5g.m.jd.com/active/taskList?` + w({
                t: Date.now()
            }),
            method: 'get'
        })
        return data.data
    },
    taskHomeCoin: async (axios, options) => {
        const { task, type } = options
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "referer": `https://isp5g.m.jd.com/`,
            },
            url: `https://isp5g.m.jd.com/active/taskHomeCoin?` + w({
                t: Date.now(),
                type: type,
                id: task.id,
            }),
            method: 'get'
        })
        console.log(data)
        if (data?.data?.jbeanNum) {
            console.reward('京豆', data?.data?.jbeanNum)
        }
    },
    taskCoin: async (axios, options) => {
        const { task } = options
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "referer": `https://isp5g.m.jd.com/`,
            },
            url: `https://isp5g.m.jd.com/active/taskCoin?` + w({
                t: Date.now(),
                type: task.type
            }),
            method: 'get'
        })
        console.log(data)
        if (data?.data?.jbeanNum) {
            console.reward('京豆', data?.data?.jbeanNum)
        }
    },
    browseProduct: async (axios, options) => {
        const { task } = options
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "referer": `https://isp5g.m.jd.com/`,
            },
            url: `https://isp5g.m.jd.com/active/browseProduct?` + w({
                t: Date.now(),
                '0': task.skuId,
            }),
            method: 'get'
        })
        console.log(data)
        if (data?.data?.jbeanNum) {
            console.reward('京豆', data?.data?.jbeanNum)
        }
    },
    followShop: async (axios, options) => {
        const { task } = options
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "referer": `https://isp5g.m.jd.com/`,
            },
            url: `https://isp5g.m.jd.com/active/followShop?` + w({
                t: Date.now(),
                'shopId': task.shopId,
            }),
            method: 'get'
        })
        console.log(data)
    },
    strollActive: async (axios, options) => {
        const { task } = options
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "referer": `https://isp5g.m.jd.com/`,
            },
            url: `https://isp5g.m.jd.com/active/strollActive?` + w({
                t: Date.now(),
                '0': task.activeId,
            }),
            method: 'get'
        })
        console.log(data)
        if (data?.data?.jbeanNum) {
            console.reward('京豆', data?.data?.jbeanNum)
        }
    },
    startGame: async (axios, options) => {
        await isp5g.coin(axios, options)
        await isp5g.risk(axios, options)
        await isp5g.getCoin(axios, options)
    },
    doTasks: async (axios, options) => {
        let { brandList, skuList } = await isp5g.conf(axios, options)
        let willskuList = skuList.filter(t => t.state === 0)
        for (let task of willskuList) {
            console.info(task.name, task.coinNum)
            await isp5g.homeGoBrowse(axios, {
                ...options,
                task,
                type: 0
            })
            await new Promise((resolve, reject) => setTimeout(resolve, 3 * 1000))
            await isp5g.taskHomeCoin(axios, {
                ...options,
                task,
                type: 0
            })
        }

        let willbrandList = brandList.filter(t => t.state === 0)
        for (let task of willbrandList) {
            console.info(task.name, task.coinNum)
            await isp5g.homeGoBrowse(axios, {
                ...options,
                task,
                type: 1
            })
            await new Promise((resolve, reject) => setTimeout(resolve, 3 * 1000))
            await isp5g.taskHomeCoin(axios, {
                ...options,
                task,
                type: 1
            })
        }

        let taskList = await isp5g.taskList(axios, options)
        let willtaskList = Object.values(taskList).filter(t => t.state === 0)
        for (let task of willtaskList) {
            console.info(task.name, task.coinNum)
            let tt = task
            let n = task.totalNum - task.finishNum
            while (n > 0) {
                if (tt.type == 4) {
                    await isp5g.browseProduct(axios, {
                        ...options,
                        task: tt
                    })
                } else if (tt.type == 2) {
                    await isp5g.followShop(axios, {
                        ...options,
                        task: tt
                    })
                    await new Promise((resolve, reject) => setTimeout(resolve, 1 * 1000))
                    await require('../api/shop').DelShopFav(axios, {
                        ...options,
                        referer: 'https://shop.m.jd.com/',
                        params: {
                            shopId: tt.shopId
                        }
                    })
                } else if (tt.type == 1) {
                    await isp5g.strollActive(axios, {
                        ...options,
                        task: tt
                    })
                } else {
                    n--
                    continue
                }
                await new Promise((resolve, reject) => setTimeout(resolve, 10 * 1000))
                await isp5g.taskCoin(axios, {
                    ...options,
                    task: tt
                })
                await new Promise((resolve, reject) => setTimeout(resolve, 1 * 1000))
                let ttt = await isp5g.taskList(axios, options)
                tt = Object.values(ttt).find(t => t.type === tt.type)

                n--
            }
        }
    }
}
module.exports = isp5g