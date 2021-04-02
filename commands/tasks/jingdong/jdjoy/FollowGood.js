const { lks_sign, transParams, w } = require('./signUtils')
const { msg } = require('./common')
var FollowGood = {
    DelProductFav: async (axios, options) => {
        const { good } = options
        let params = {
            commId: good.sku + '',
            _: Date.now(),
            sceneval: 2,
            g_login_type: 1,
            g_ty: 'ls',
        }
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "referer": 'https://shop.m.jd.com/'
            },
            url: `https://wq.jd.com/fav/comm/FavCommDel?` + w(params),
            method: 'get'
        })
        if (data.iRet === 0) {
            console.info('取消收藏商品成功')
        } else {
            console.error('取消收藏商品失败', data)
        }
    },
    doTask: async (axios, options) => {
        const { task, pet } = options
        console.log(`开始完成【${task.taskName}】任务中`)
        let goods = task.followGoodList
        let willgoods = goods.filter(g => g.status === false)
        for (let good of willgoods) {
            await FollowGood.followgoodstart(axios, {
                ...options,
                good
            })
            await new Promise((resolve, reject) => setTimeout(resolve, 5 * 1000))
            await FollowGood.followShopEnd(axios, {
                ...options,
                good
            })
            await new Promise((resolve, reject) => setTimeout(resolve, 5 * 1000))

            await FollowGood.DelProductFav(axios, {
                ...options,
                good
            })
        }
        if (willgoods.length) {
            let tasks = await pet.getPetTaskConfig(axios, options)
            let tasknew = tasks.find(t => t.taskType === task.taskType)
            console.log(`任务进度${tasknew.joinedCount || 0}/${tasknew.taskChance}`)
        }
    },
    followgoodstart: async (axios, options) => {
        const { good } = options
        let lkt = Date.now()
        let params = {
            'reqSource': 'h5',
            'lks': lks_sign(lkt),
            'lkt': lkt,
            'iconCode': 'follow_good',
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
            console.info(`进入商品页[${good.skuName}]成功`)
        } else {
            console.error(`进入商品页[${good.skuName}]失败`, data.errorMessage)
        }
    },
    followShopEnd: async (axios, options) => {
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
            url: `https://jdjoy.jd.com/common/pet/followGood?` + w(params),
            method: 'POST',
            data: transParams({
                'sku': good.sku
            })
        })
        if (data.success) {
            if (data.errorCode === 'follow_success') {
                console.info(`关注商品[${good.skuName}]成功`)
            } else {
                console.error(`关注商品[${good.skuName}}]失败`, msg[data.errorCode])
            }
        } else {
            console.error(`关注商品[${good.skuName}}]失败`, data.errorMessage)
        }
    }
}
module.exports = FollowGood