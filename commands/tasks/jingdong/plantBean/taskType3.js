
const { w } = require('../sign/common')
// 浏览店铺
var task = {
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
    shopTaskList: async (axios, options) => {
        let params = {
            functionId: 'shopTaskList',
            body: JSON.stringify({ "monitor_source": "plant_m_plant_index", "monitor_refer": "plant_shopList", "version": "9.2.4.0" }),
            appid: 'ld',
            client: 'android',
            clientVersion: '9.4.4',
            networkType: '',
            osVersion: '',
            uuid: ''
        }
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "referer": 'https://bean.m.jd.com/'
            },
            url: `https://api.m.jd.com/client.action?` + w(params),
            method: 'get'
        })
        return [...data.data.goodShopList, ...data.data.moreShopList]
    },
    shopNutrientsTask: async (axios, options) => {
        const { shop } = options
        let params = {
            functionId: 'shopNutrientsTask',
            body: JSON.stringify({
                "shopTaskId": shop.shopTaskId + '',
                "shopId": shop.shopId + '',
                "monitor_source": "plant_m_plant_index",
                "monitor_refer": "plant_shopNutrientsTask",
                "version": "9.2.4.0"
            }),
            appid: 'ld',
            client: 'android',
            clientVersion: '9.4.4',
            networkType: '',
            osVersion: '',
            uuid: ''
        }
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "referer": 'https://bean.m.jd.com/'
            },
            url: `https://api.m.jd.com/client.action?` + w(params),
            method: 'get'
        })
        if (data.code === '0') {
            if (!data.errorCode) {
                let n = data.data.nutrState === '1' ? data.data.nutrCount : 0
                console.info('领取营养液成功', n)
                return n > 0 ? true : false
            } else {
                console.error('领取营养液失败', data.errorMessage)
            }
        } else {
            console.error('领取营养液失败', data)
        }
    },
    doTask: async (axios, options) => {
        let shops = await task.shopTaskList(axios, options)
        shops = shops.filter(s => s.taskState === '2')
        console.info('剩余未完成店铺', shops.length)

        // 4次有效即可
        let n = 0

        for (let shop of shops) {
            console.log('浏览店铺', shop.shopName)
            let flag = await task.shopNutrientsTask(axios, {
                ...options,
                shop
            })
            if (flag) {
                n++
            }
            await new Promise((resolve, reject) => setTimeout(resolve, 5 * 1000))

            await task.DelShopFav(axios, {
                ...options,
                shop
            })

            if (n >= 4) {
                break
            }
        }

        if (shops.length) {
            return true
        }

    }
}

module.exports = task