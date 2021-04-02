const { parseCookie } = require('../../../../utils/util')
const { getFp, transParams } = require('../sign/common')

var Babel_Sign = {
    Babel_Sign: async (axios, options) => {
        const { activity, actKParams } = options
        let cookies = parseCookie(options.cookies, ['shshshfp', 'shshshfpa', 'shshshfpb', '__jdu', '3AB9D23F7A4B3C9B'])
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "referer": activity.url,
            },
            url: `https://api.m.jd.com/client.action?functionId=userSign`,
            method: 'post',
            data: transParams({
                'body': JSON.stringify({
                    "params": actKParams,
                    "riskParam": {
                        "platform": "3",
                        "orgType": "2",
                        "openId": "-1",
                        "pageClickKey": "Babel_Sign",
                        "eid": cookies['3AB9D23F7A4B3C9B'],
                        "fp": getFp(axios, options),
                        "shshshfp": cookies.shshshfp,
                        'shshshfpa': cookies.shshshfpa,
                        'shshshfpb': cookies.shshshfpb,
                        "childActivityUrl": encodeURIComponent(activity.url),
                        "userArea": "-1",
                        "client": "-1",
                        "clientVersion": "-1",
                        "uuid": "-1",
                        "osVersion": "-1",
                        "brand": "-1",
                        "model": "-1",
                        "networkType": "-1",
                        "jda": "-1"
                    },
                    // "siteClient": "android",
                    // "mitemAddrId": "",
                    // "geo": {
                    //     "lng": "106.737894",
                    //     "lat": "26.490248"
                    // },
                    // "addressId": "2102328362",
                    // "posLng": "",
                    // "posLat": "",
                    // "homeLng": "104.14017",
                    // "homeLat": "30.62072",
                    // "focus": "",
                    // "innerAnchor": "",
                    // "cv": "2.0"
                }),
                'clientVersion': '1.0.0',
                'area': '',
                'sid': '',
                'screen': '750*1334',
                'uuid': cookies.__jdu,
                'client': 'wh5'
            })
        })
        if (data.code === '0') {
            if (data.subCodeMsg === 'SUCCESS') {
                console.info(activity.name, '签到成功', data.noAwardTxt || '', data.statistics)
            } else {
                console.error(activity.name, '签到失败', data)
            }
        } else {
            console.error(activity.name, '签到失败', data.msg || data.echo || '')
        }
    },
}
module.exports = Babel_Sign