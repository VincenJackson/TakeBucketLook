const { transParams, w } = require('../sign/common')

const crypto = require("crypto");

var crypto_encrypt = function (data, key, iv) {
    var cipherEncoding = 'base64';
    var cipher = crypto.createCipheriv('aes-128-cbc', Buffer.from(key, 'base64'), iv);
    cipher.setAutoPadding(true);
    return Buffer.concat([cipher.update(data), cipher.final()]).toString(cipherEncoding);
}

var crypto_decrypt = function (data, key, iv) {
    var clearEncoding = 'utf8';
    var cipherEncoding = 'base64';
    var decipher = crypto.createDecipheriv('aes-128-cbc', Buffer.from(key, 'base64'), iv);
    decipher.setAutoPadding(true);
    return Buffer.concat([decipher.update(data, cipherEncoding), decipher.final()]).toString(clearEncoding);
}

var task = {
    getRealAddress: async (axios, options) => {
        let params = {
            "appid": "51370da79b5cc75efc43a19477c5249c",
            "ifdetail": "0",
            "isdefaultipaddr": "1",
            "uuid": "",
            "appkey": "1",
            ...options.lbs
        }
        let lbs_api_key = 'aC60xcD7O2U1hQnLgV8umA'
        let SDKVersion = '1.0.4'
        let splitArr = SDKVersion.split('.')
        let bArr = new Int8Array(Buffer.alloc(16))
        if (splitArr.length > 2) {
            bArr[13] = splitArr[0];
            bArr[14] = splitArr[1];
            bArr[15] = splitArr[2];
        }
        let encryptWithVersion = crypto_encrypt(JSON.stringify(params), 'aC60xcD7O2U1hQnLgV8umA', bArr)
        let url = "https://lbsapi.m.jd.com/o?d=" + SDKVersion + "|" + encryptWithVersion.replace(/\+/g, '-').replace(/\//g, '_')
        let { data } = await axios.request({
            url,
            method: 'get'
        })
        return crypto_decrypt(data.data, lbs_api_key, bArr)
    },
    city_getHomeData: async (axios, options) => {

        console.error('默认使用的贵州 -- ！！！！作为当前的领取地址城市，你需要更改该值')

        // 默认使用的贵州 -- ！！！！
        let lbsCity = {
            provinceid: '24',
            cityid: '2144'
        }
        // 可用以下方法获得地理坐标的城市ID
        // lbsCity = await task.getRealAddress(axios, {
        //     ...options,
        //     lbs: {
        //         // 以下填写为真实的坐标
        //         "lat": "26.490251",
        //         "lng": "106.737898",
        //     }
        // })

        // lbsCity.provinceid => lbsCity
        // lbsCity.cityid  => realLbsCity
        let params = {
            functionId: 'city_getHomeData',
            body: JSON.stringify({
                "lbsCity": lbsCity.provinceid,
                "realLbsCity": lbsCity.cityid,
                "inviteId": "",
                "headImg": "",
                "userName": ""
            }),
            client: 'wh5',
            clientVersion: '9.4.4',
            uuid: ''
        }
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": 'https://bunearth.m.jd.com',
                "referer": 'https://bunearth.m.jd.com/babelDiy/Zeus/x4pWW6pvDwW7DjxMmBbnzoub8J/index.html?babelChannel=fc1'
            },
            url: `https://api.m.jd.com/client.action`,
            method: 'POST',
            data: transParams(params)
        })
        if (data.code === 0) {
            if (data.data.bizCode === 0) {
                let result = data.data.result
                let user = result.userActBaseInfo
                console.info('用户奖池', user.nickname, user.poolMoney)
                if (result.popWindows) {
                    console.info('本次可取的现金', result.popWindows[0].data.curCityName || '无', result.popWindows[0].data.cash || '无')
                    return true
                } else {
                    console.info('本次可取的现金', '无')
                }
            } else {
                console.error('获取信息失败', data.data.bizMsg)
            }
        } else {
            console.error('获取信息失败', data)
        }
    },
    city_receiveCash: async (axios, options) => {
        let params = {
            functionId: 'city_receiveCash',
            body: JSON.stringify({ "cashType": "2" }), // ？1,2,3,4
            client: 'wh5',
            clientVersion: '9.4.4',
            //uuid: ''
        }
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "referer": 'https://bunearth.m.jd.com/babelDiy/Zeus/x4pWW6pvDwW7DjxMmBbnzoub8J/index.html?babelChannel=fc1'
            },
            url: `https://api.m.jd.com/client.action`,
            method: 'POST',
            data: transParams(params)
        })
        if (data.code === 0) {
            if (data.data.bizCode === 0) {
                console.info(data)
                // console.reward('现金', data.data.result.signCash)
            } else {
                console.error('获取现金失败', data.data.bizMsg)
            }
        } else {
            console.error('获取现金失败', data)
        }
    },
    doTask: async (axios, options) => {
        let flag = await task.city_getHomeData(axios, options)
        if (flag) {
            await task.city_receiveCash(axios, options)
        }
    }
}

module.exports = task