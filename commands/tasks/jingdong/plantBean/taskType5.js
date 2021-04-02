
const { w } = require('../sign/common')
// 关注商品
var task = {
    DelProductFav: async (axios, options) => {
        const { product } = options
        let params = {
            commId: product.skuId + '',
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
    productTaskList: async (axios, options) => {
        let params = {
            functionId: 'productTaskList',
            body: JSON.stringify({ "monitor_source": "plant_m_plant_index", "monitor_refer": "plant_productTaskList", "version": "9.2.4.0" }),
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
        return [...data.data.productInfoList.flat()]
    },
    productNutrientsTask: async (axios, options) => {
        const { product } = options
        let params = {
            functionId: 'productNutrientsTask',
            body: JSON.stringify({
                "productTaskId": product.productTaskId,
                "skuId": product.skuId,
                "monitor_source": "plant_m_plant_index",
                "monitor_refer": "plant_productNutrientsTask",
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
        let products = await task.productTaskList(axios, options)
        products = products.filter(s => s.taskState === '2')
        console.info('剩余未完成商品', products.length)

        // 6次有效即可
        let n = 0

        for (let product of products) {
            console.log('浏览商品', product.productName)
            let flag = await task.productNutrientsTask(axios, {
                ...options,
                product
            })
            if (flag) {
                n++
            }
            await new Promise((resolve, reject) => setTimeout(resolve, 5 * 1000))

            await task.DelProductFav(axios, {
                ...options,
                product
            })

            if (n >= 6) {
                break
            }
        }

        if (products.length) {
            return true
        }

    }
}

module.exports = task