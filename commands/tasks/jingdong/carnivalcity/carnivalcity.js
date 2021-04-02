const crypto = require('crypto');
const { w } = require('../sign/common');
const { reqApiSign, reqApiNoSign } = require('../api/client');


let md5 = (s) => {
    return crypto.createHash("md5").update(s, "utf8").digest("hex")
}
let R = function (t, e, n) {
    var a = ""
        , i = n.split("?")[1] || "";
    if (t) {
        if ("string" == typeof t)
            a = t + i;
        else if ("object" == P(t)) {
            var r = [];
            for (var s in t)
                r.push(s + "=" + t[s]);
            a = r.length ? r.join("&") + i : i
        }
    } else
        a = i;
    if (a) {
        var o = a.split("&").sort().join("");
        return md5(o + e)
    }
    return md5(e)
}

function P (t) {
    return P = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function (t) {
        return typeof t
    }
        : function (t) {
            return t && "function" === typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
        }
        ,
        P(t)
}

// https://carnivalcity.m.jd.com/?innerIndex=1

var carnivalcity = {
    sign: (params, apiPath) => {
        let md5AppKey = '07035cabb557f09a5'
        let s = (new Date).getTime()
        let o = md5AppKey + s
        let sign = R(params, o, apiPath)
        return {
            sign,
            timestamp: s
        }
    },
    reqApi: async (axios, options) => {
        const { params, apiPath, method } = options
        let { sign, timestamp } = carnivalcity.sign(params, apiPath)
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": `https://carnivalcity.m.jd.com`,
                "referer": `https://carnivalcity.m.jd.com/?innerIndex=1`,
                sign,
                timestamp
            },
            url: `https://carnivalcity.m.jd.com${apiPath}?` + w(params),
            method: method || 'get'
        })
        return data
    },
    indexInfo: async (axios, options) => {
        let data = await carnivalcity.reqApi(axios, {
            ...options,
            params: {
                t: (new Date).getTime()
            },
            apiPath: '/khc/index/indexInfo'
        })
        return data.data
    },
    doQuestion: async (axios, options) => {
        const { brand, questionId, result } = options
        let data = await carnivalcity.reqApi(axios, {
            ...options,
            method: 'post',
            params: {
                brandId: brand.brandId,
                questionId,
                result
            },
            apiPath: '/khc/task/doQuestion'
        })
        if (data?.data?.jingBean) {
            console.reward('京豆', data?.data?.jingBean)
        }
        if (data?.data?.integral) {
            console.info('积分', data?.data?.integral)
        }
    },
    qryViewkitCallbackResult: async (axios, options) => {
        const { brand, browseId } = options
        let data = await reqApiSign(axios, {
            ...options,
            functionId: 'qryViewkitCallbackResult',
            body:
            {
                clientLanguage: "zh",
                dataSource: "browsePrize",
                method: "browsePrize",
                reqParams: JSON.stringify({
                    "taskType": brand.brandId,
                    "targetId": browseId
                }),
                taskSDKVersion: "1.0.4",
                vkVersion: "1.0.0"
            }
        })
        console.log(data.refreshKey)
    },
    followShop: async (axios, options) => {
        const { brand, item, taskMark, type, logMark } = options
        let data = await carnivalcity.reqApi(axios, {
            ...options,
            params: {
                brandId: brand.brandId,
                id: item.id
            },
            apiPath: '/khc/task/followShop'
        })
        if (data?.data?.jingBean) {
            console.reward('京豆', data?.data?.jingBean)
        }
        if (data?.data?.integral) {
            console.info('积分', data?.data?.integral)
        }
    },
    getDelayTaskStatus: async (axios, options) => {
        const { browseId } = options
        let data = await carnivalcity.reqApi(axios, {
            ...options,
            params: {
                browseId,
                t: (new Date).getTime()
            },
            apiPath: '/khc/task/getDelayTaskStatus'
        })
        console.log(data)
        if (data?.data?.jingBean) {
            console.reward('京豆', data?.data?.jingBean)
        }
        if (data?.data?.integral) {
            console.info('积分', data?.data?.integral)
        }
    },
    followChannel: async (axios, options) => {
        const { brand, item, taskMark, type, logMark } = options
        let data = await carnivalcity.reqApi(axios, {
            ...options,
            params: {
                brandId: brand.brandId,
                id: item.id
            },
            apiPath: '/khc/task/followChannel'
        })
        if (data?.data?.jingBean) {
            console.reward('京豆', data?.data?.jingBean)
        }
        if (data?.data?.integral) {
            console.info('积分', data?.data?.integral)
        }
    },
    doBrowse: async (axios, options) => {
        const { brand, item, taskMark, type, logMark } = options
        let data = await carnivalcity.reqApi(axios, {
            ...options,
            params: {
                brandId: brand.brandId,
                id: item.id,
                taskMark,
                type,
                logMark,
            },
            apiPath: '/khc/task/doBrowse'
        })
        return data.data.browseId
    },
    getBrowsePrize: async (axios, options) => {
        const { brand, browseId } = options
        let data = await carnivalcity.reqApi(axios, {
            ...options,
            params: {
                brandId: brand.brandId,
                browseId
            },
            apiPath: '/khc/task/getBrowsePrize'
        })
        if (data?.data?.jingBean) {
            console.reward('京豆', data?.data?.jingBean)
        }
        if (data?.data?.integral) {
            console.info('积分', data?.data?.integral)
        }
    },
    brandTaskInfo: async (axios, options) => {
        const { brand } = options
        let data = await carnivalcity.reqApi(axios, {
            ...options,
            params: {
                brandId: brand.brandId,
                t: (new Date).getTime()
            },
            apiPath: '/khc/index/brandTaskInfo'
        })
        return data.data
    },
    doTask: async (axios, options) => {
        let { brandList } = await carnivalcity.indexInfo(axios, options)
        for (let brand of brandList) {
            console.info(brand.brandName)
            let { skuTask, shopTask, meetingTask, questionTask } = await carnivalcity.brandTaskInfo(axios, {
                ...options,
                brand
            })
            let willskuTask = skuTask.filter(t => t.status === '0')
            for (let shop of willskuTask) {
                let browseId = await carnivalcity.doBrowse(axios, {
                    ...options,
                    brand,
                    item: shop,
                    taskMark: 'brand',
                    type: 'presell',
                    logMark: 'browseSku'
                })
                await new Promise((resolve, reject) => setTimeout(resolve, 3 * 1000))
                await carnivalcity.getBrowsePrize(axios, {
                    ...options,
                    brand,
                    browseId
                })
                await new Promise((resolve, reject) => setTimeout(resolve, 1 * 1000))
            }

            let willshopTask = shopTask.filter(t => t.status === '10')
            for (let shop of willshopTask) {
                if (!shop.url) {
                    await carnivalcity.followShop(axios, {
                        ...options,
                        brand,
                        item: shop
                    })
                    await new Promise((resolve, reject) => setTimeout(resolve, 1 * 1000))
                    await require('../api/shop').DelShopFav(axios, {
                        ...options,
                        referer: 'https://shop.m.jd.com/',
                        params: {
                            shopId: shop.id
                        }
                    })
                    await new Promise((resolve, reject) => setTimeout(resolve, 1 * 1000))
                } else {
                    await carnivalcity.followChannel(axios, {
                        ...options,
                        brand,
                        item: shop
                    })
                    await new Promise((resolve, reject) => setTimeout(resolve, 1 * 1000))
                    await require('../api/channel').DelChannelFav(axios, {
                        ...options,
                        channel: {
                            channelId: shop.id
                        }
                    })
                    await new Promise((resolve, reject) => setTimeout(resolve, 1 * 1000))
                }
            }


            let willmeetingTask = meetingTask.filter(t => t.status === '7')
            for (let shop of willmeetingTask) {
                let browseId = await carnivalcity.doBrowse(axios, {
                    ...options,
                    brand,
                    item: shop,
                    taskMark: 'brand',
                    type: 'meeting',
                    logMark: 'browseVenue'
                })
                await new Promise((resolve, reject) => setTimeout(resolve, 10 * 1000))
                await carnivalcity.qryViewkitCallbackResult(axios, {
                    ...options,
                    brand,
                    browseId
                })
                await carnivalcity.getDelayTaskStatus(axios, {
                    ...options,
                    browseId
                })
                await new Promise((resolve, reject) => setTimeout(resolve, 1 * 1000))
            }

            if (questionTask.result === '0') {
                await carnivalcity.doQuestion(axios, {
                    ...options,
                    brand,
                    questionId: questionTask.id,
                    result: '1'
                })
                await new Promise((resolve, reject) => setTimeout(resolve, 1 * 1000))
            }
        }

    }

}
module.exports = carnivalcity