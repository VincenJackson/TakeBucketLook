const { lks_sign, transParams, w } = require('./signUtils')
const { msg } = require('./common')
var ScanGood = {
    doTask: async (axios, options) => {
        console.log('开始完成【逛商品得100积分】任务中')
        const { goods } = await ScanGood.ScanDeskGoodList(axios, options)
        let willgoods = goods.filter(g => g.status === false)
        for (let good of willgoods) {
            await ScanGood.ScanDeskGoodStart(axios, {
                ...options,
                good
            })
            await new Promise((resolve, reject) => setTimeout(resolve, 10 * 1000))
            await ScanGood.ScanDeskGoodEnd(axios, {
                ...options,
                good
            })
        }
        if (willgoods.length) {
            const { goods: goodnews } = await ScanGood.ScanDeskGoodList(axios, options)
            if (!goodnews.filter(g => g.status === false).length) {
                console.info('【逛商品得100积分】已完成，获得100积分')
            }
        }
    },
    ScanDeskGoodList: async (axios, options) => {
        let lkt = Date.now()
        let params = {
            'reqSource': 'h5',
            'lks': lks_sign(lkt),
            'lkt': lkt
        }
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": "https://h5.m.jd.com",
                "referer": `https://h5.m.jd.com/`,
            },
            url: `https://jdjoy.jd.com/common/pet/getDeskGoodDetails?` + w(params),
            method: 'get'
        })
        if (data.success) {
            console.info('加载商品浏览任务配置成功', `进度${data.data.followCount || 0}/${data.data.taskChance || 0}`)
            return {
                taskChance: data.data.taskChance - data.data.followCount,
                goods: data.data.deskGoods || []
            }
        } else {
            console.error('加载商品浏览任务失败', data.errorMessage)
            return { taskChance: 0, goods: [] }
        }
    },
    ScanDeskGoodStart: async (axios, options) => {
        const { good } = options
        let lkt = Date.now()
        let params = {
            'reqSource': 'h5',
            'lks': lks_sign(lkt),
            'lkt': lkt,
            'iconCode': 'follow_good_desk',
            'linkAddr': good.sku
        }
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": "https://h5.m.jd.com",
                "referer": `https://h5.m.jd.com/`,
            },
            url: `https://jdjoy.jd.com/common/pet/icon/click?` + w(params),
            method: 'get'
        })
        if (data.success) {
            console.info(`完成浏览商品[${good.skuName}]成功`)
        } else {
            console.error(`完成浏览商品[${good.skuName}]失败`, data.errorMessage)
        }
    },
    ScanDeskGoodEnd: async (axios, options) => {
        const { good } = options
        let lkt = Date.now()
        let params = {
            'reqSource': 'h5',
            'lks': lks_sign(lkt),
            'lkt': lkt
        }
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": "https://h5.m.jd.com",
                "referer": `https://h5.m.jd.com/`,
            },
            url: `https://jdjoy.jd.com/common/pet/scan?` + w(params),
            method: 'POST',
            data: {
                sku: good.sku,
                taskType: "ScanDeskGood"
            }
        })
        if (data.success) {
            if (data.errorCode === 'follow_success') {
                console.info(`开始浏览商品[${good.skuName}]成功`)
            } else {
                console.error(`开始浏览商品[${good.skuName}}]失败`, msg[data.errorCode])
            }
        } else {
            console.error(`开始浏览商品[${good.skuName}]失败`, data.errorMessage)
        }
    }
}
module.exports = ScanGood