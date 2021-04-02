
const { Babel_Sign } = require('./Babel_Sign')
const { reqApiSign } = require('../api/client')
const { parseCookie } = require('../../../../utils/util')

// 京东拍拍二手
var paipaiershou = {
    detail: async (axios, options) => {
        let cookies = parseCookie(options.cookies, ['3AB9D23F7A4B3C9B'])
        let data = await reqApiSign(axios, {
            ...options,
            functionId: 'qryAppBabelFloors',
            body: {
                activityId: "3S28janPLYmtFxypu37AYAGgivfp",
                "riskParam": {
                    "eid": cookies['3AB9D23F7A4B3C9B'],
                    'shshshfpb': cookies.shshshfpb
                }
            }
        })
        return data.floorList.find(f => f.template === 'signIn')
    },
    sign: async (axios, options) => {
        await Babel_Sign(axios, {
            ...options,
            actKParams: options.actKParams,
            activity: {
                "url": 'https://pro.m.jd.com/',
                'name': "京东拍拍二手"
            }
        })
    },
    doTask: async (axios, options) => {
        let sign = await paipaiershou.detail(axios, options)
        if (sign) {
            if (sign.signInfos.signStat === '0') {
                await paipaiershou.sign(axios, {
                    ...options,
                    actKParams: sign.signInfos.params
                })
            } else {
                console.error('今日已签到')
            }
        } else {
            console.error('没有签到活动')
        }
    }
}
module.exports = paipaiershou