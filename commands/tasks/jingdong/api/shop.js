const { w } = require('../sign/common')
var shop = {
    getShopVenderId: async (axios, options) => {
        const { referer, shopId } = options
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "referer": referer,
            },
            url: `https://shop.m.jd.com/?shopId=${shopId}`,
            method: 'get'
        })
        return data.substr(data.indexOf('venderId: ') + 10, 12).replace(/[ ,]/g, '')
    },
    AddShopFav: async (axios, options) => {
        const { referer, params } = options
        if (!params.venderId) {
            params.venderId = await shop.getShopVenderId(axios, {
                ...options,
                referer,
                shopId: params.shopId
            })
        }
        console.info(`关注店铺中`)
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "referer": referer,
            },
            url: `https://wq.jd.com/fav/shop/AddShopFav?` + w({
                'sceneval': 2,
                'g_login_type': 1,
                't': Date.now(),
                '_': Date.now(),
                ...params
            }),
            method: 'get'
        })
        if (data.iRet === '0') {
            console.info(`关注店铺成功`)
        } else {
            console.error(`关注店铺失败`)
        }
    },
    DelShopFav: async (axios, options) => {
        const { referer, params } = options
        if (!params.venderId) {
            params.venderId = await shop.getShopVenderId(axios, {
                ...options,
                referer,
                shopId: params.shopId
            })
        }
        console.info(`取消关注店铺[${params.shopId}]中`)
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "referer": referer,
            },
            url: `https://wq.jd.com/fav/shop/DelShopFav?` + w({
                'sceneval': 2,
                'g_login_type': 1,
                't': Date.now(),
                '_': Date.now(),
                ...params
            }),
            method: 'get'
        })
        if (data.iRet === '0') {
            console.info(`取消关注店铺[${params.shopId}]成功`)
        } else {
            console.error(`取消关注店铺[${params.shopId}]失败`)
        }
    },
}
module.exports = shop