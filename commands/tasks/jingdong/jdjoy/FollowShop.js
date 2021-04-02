const { lks_sign, transParams, w } = require('./signUtils')
var FollowShop = {
    DelShopFav: async (axios, options) => {
        const { shop } = options
        let params = {
            shopId: shop.shopId,
            venderId: shop.shopId,
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
            url: `https://wq.jd.com/fav/shop/DelShopFav?` + w(params),
            method: 'get'
        })
        if (data.iRet === '0') {
            console.info('取消收藏店铺成功')
        } else {
            console.error('取消收藏店铺失败', data)
        }
    },
    doTask: async (axios, options) => {
        const { task } = options
        console.log(`开始完成【${task.taskName}】任务中`)
        const { shops } = await FollowShop.getFollowShops(axios, options)
        let willshops = shops.filter(g => g.status === false)
        for (let shop of willshops) {
            await FollowShop.followShopStart(axios, {
                ...options,
                shop
            })
            await new Promise((resolve, reject) => setTimeout(resolve, 5 * 1000))
            await FollowShop.followShopEnd(axios, {
                ...options,
                shop
            })

            await new Promise((resolve, reject) => setTimeout(resolve, 5 * 1000))

            await FollowShop.DelShopFav(axios, {
                ...options,
                shop
            })
        }
        if (willshops.length) {
            const { shops: shopsnew } = await FollowShop.getFollowShops(axios, options)
            if (!shopsnew.filter(g => g.status === false).length) {
                console.info(`【${task.taskName}】已完成, 获得狗粮${task.taskReward}g`)
            }
        }
    },
    getFollowShops: async (axios, options) => {
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
            url: `https://jdjoy.jd.com/common/pet/getFollowShops?` + w(params),
            method: 'get'
        })

        if (data.success) {
            console.log('加载关注任务配置成功')
            return {
                shops: data.datas
            }
        } else {
            console.error('加载关注任务失败', data.errorMessage)
            return {
                shops: []
            }
        }
    },
    followShopStart: async (axios, options) => {
        const { shop } = options
        let lkt = Date.now()
        let params = {
            'reqSource': 'h5',
            'lks': lks_sign(lkt),
            'lkt': lkt,
            'iconCode': 'follow_shop',
            'linkAddr': shop.shopId
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
            console.info(`进入店铺[${shop.name}]成功`)
        } else {
            console.error(`进入店铺[${shop.name}]失败`, data.errorMessage)
        }
    },
    followShopEnd: async (axios, options) => {
        const { shop } = options
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
            url: `https://jdjoy.jd.com/common/pet/followShop?` + w(params),
            method: 'POST',
            data: transParams({
                shopId: shop.shopId
            })
        })
        if (data.success) {
            if (data.errorCode === 'success') {
                console.info(`关注店铺[${shop.name}]成功`)
            } else if (data.errorCode === 'repeat') {
                console.error(`店铺[${shop.name}}]已关注过`)
            } else {
                console.error(`关注店铺[${shop.name}}]失败`)
            }
        } else {
            console.error(`关注店铺[${shop.name}}]失败`, data.errorMessage)
        }
    }
}
module.exports = FollowShop