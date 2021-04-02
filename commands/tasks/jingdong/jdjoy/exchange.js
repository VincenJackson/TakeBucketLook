const { lks_sign, transParams, w } = require('./signUtils')
const { parseCookie } = require('../../../../utils/util')

function resetDeviceInfo(e) {
    return {
        "eid": (e = e || {}).eid || "",
        "fp": e.fp || "",
        "deviceType": e.dt || "",
        "macAddress": e.ma || "",
        "imei": e.im || "",
        "os": e.os || "",
        "osVersion": e.osv || "",
        "ip": e.ip || "",
        "appId": e.apid || "",
        "openUUID": e.ou || "",
        "idfa": e.ia || "",
        "uuid": e.uu || "",
        "clientVersion": e.cv || "",
        "networkType": e.nt || "",
        "appType": e.at || "",
        "sdkToken": e.sto || e.sdkToken || ""
    }
}
// TODO
var exchange = {
    getBeanConfigs: async (axios, options) => {
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
            url: `https://jdjoy.jd.com/common/gift/getBeanConfigs?` + w(params),
            method: 'get'
        })
        return data.data
    },
    // fix
    doTask: async (axios, options) => {
        const { task, pet } = options
        console.log(`开始完成【${task.taskName}】任务中`)

        let cookies = parseCookie(options.cookies, ['3AB9D23F7A4B3C9B'])
        console.log(cookies)

        let risk_jd = {
            // https://gias.jd.com/js/m.js _JdEid
            // cookie 3AB9D23F7A4B3C9B
            eid: cookies['3AB9D23F7A4B3C9B'],

            // https://gias.jd.com/js/m.js risk_jd_local_fingerprint
            // fp: "",

            // https://gias.jd.com/js/m.js jd_shadow__
            // jstub: "",
            sdkToken: "",
            // https://gia.jd.com/m.html  jd_risk_token_id 
            // token: ""
        }

        let deviceInfo = resetDeviceInfo(risk_jd)

        let lkt = Date.now()
        let params = {
            'reqSource': 'h5',
            'lks': lks_sign(lkt),
            'lkt': lkt
        }
        console.log('尝试使用360积分兑换20京豆')
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": "https://h5.m.jd.com",
                "referer": `https://h5.m.jd.com/`,
            },
            url: `https://jdjoy.jd.com/common/gift/new/exchange?` + w(params),
            method: 'POST',
            data: {
                "buyParam": {
                    "orderSource": "pet",
                    "saleInfoId": '334'
                },
                "deviceInfo": deviceInfo
            }
        })
        let msg = {
            buy_limit: '只能兑换一次哦~',
            buy_fail: '兑换失败',
            stock_empty: '无库存',
            sku_offsale: '已下架',
            insufficient: '积分不足'
        }
        if (data.success) {
            if (data.errorCode === 'buy_success') {
                await pet.getFood(axios, {
                    ...options,
                    taskType: 'exchange'
                })
                console.info('兑换成功')
                console.reward('京豆', 20)
            } else {
                console.error('兑换失败', msg[data.errorCode] || '未知错误')
            }
        } else {
            console.error('兑换失败', data.errorMessage)
        }

    }
}

module.exports = exchange