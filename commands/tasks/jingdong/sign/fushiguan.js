
const { Babel_Sign } = require('./Babel_Sign')
const { reqApiSign } = require('../api/client')
const { parseCookie } = require('../../../../utils/util')

// 京东服饰馆
// https://pro.m.jd.com/mall/active/3qMkfmPMc55RTahmSSpwwuxVrYMG/index.html
var fushiguan = {
    detail: async (axios, options) => {
        let cookies = parseCookie(options.cookies, ['3AB9D23F7A4B3C9B'])
        let data = await reqApiSign(axios, {
            ...options,
            functionId: 'qryAppBabelFloors',
            body: {
                activityId: "4RBT3H9jmgYg1k2kBnHF8NAHm7m8",
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
                'name': "京东服饰馆"
            }
        })
    },
    doTask: async (axios, options) => {
        let sign = await fushiguan.detail(axios, options)
        if (sign.signInfos.signStat === '0') {
            await fushiguan.sign(axios, {
                ...options,
                actKParams: sign.signInfos.params
            })
        } else {
            console.error('今日已签到')
        }
    }
}
module.exports = fushiguan