
const { Babel_Sign } = require('./Babel_Sign')
const { reqApiSign } = require('../api/client')
const { parseCookie } = require('../../../../utils/util')

// 京东珠宝
var zhubaoguan = {
    detail: async (axios, options) => {
        let cookies = parseCookie(options.cookies, ['3AB9D23F7A4B3C9B'])
        let data = await reqApiSign(axios, {
            ...options,
            functionId: 'qryAppBabelFloors',
            body: {
                activityId: "zHUHpTHNTaztSRfNBFNVZscyFZU",
                "riskParam": {
                    "eid": cookies['3AB9D23F7A4B3C9B'],
                    'shshshfpb': cookies.shshshfpb
                }
            }
        })
        return data.floatLayerList.find(f => f.styleId == 3)
    },
    sign: async (axios, options) => {
        await Babel_Sign(axios, {
            ...options,
            actKParams: options.actKParams,
            activity: {
                "url": 'https://pro.m.jd.com/',
                'name': "京东珠宝"
            }
        })
    },
    doTask: async (axios, options) => {
        let sign = await zhubaoguan.detail(axios, options)
        await zhubaoguan.sign(axios, {
            ...options,
            actKParams: sign.params
        })
    }
}
module.exports = zhubaoguan