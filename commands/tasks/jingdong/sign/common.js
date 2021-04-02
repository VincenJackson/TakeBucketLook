const { builduts } = require('../crazy_joy/common')
const { parseCookie } = require('../../../../utils/util')
var crypto = require('crypto');

var transParams = (data) => {
    let params = new URLSearchParams();
    for (let item in data) {
        params.append(item, data['' + item + '']);
    }
    return params;
};

function w () {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}
        , t = [];
    return Object.keys(e).forEach((function (a) {
        t.push("".concat(a, "=").concat(encodeURIComponent(e[a])))
    }
    )),
        t.join("&")
}

var common = {
    w,
    transParams,
    reqApi: async (axios, options) => {
        const { params, body } = options
        let { data } = await axios.request({
            headers: {
                "user-agent": "okhttp/3.12.1",
            },
            url: `https://api.m.jd.com/client.action?` + w(params),
            method: 'post',
            data: transParams({
                body: body
            })
        })
        return data
    },
    buildSignParams: async (axios, params) => {
        const { functionId, uuid, body, options, appid } = params
        let cookies = parseCookie(options.cookies, ['shshshfp', 'shshshfpa', 'shshshfpb', '__jdu', '3AB9D23F7A4B3C9B'])

        let clientVersion = '9.4.4'
        let client = 'android'
        params = {
            functionId: functionId,
            clientVersion,
            client,
            appid: appid || '',

            build: '87076',
            d_brand: 'HUAWEI',
            d_model: 'VKY-AL00',
            osVersion: '9',
            screen: '1920*1080',
            partner: 'huawei',
            oaid: '00000000-0000-0000-0000-000000000000',
            eid: cookies['3AB9D23F7A4B3C9B'],
            sdkVersion: '28',
            lang: 'zh_CN',
            aid: uuid || cookies.__jdu,
            area: '',
            networkType: 'wifi',
            wifiBssid: 'unknown',
            uts: builduts(body, Date.now()),

            uuid: uuid || cookies.__jdu,
        }

        let sign1 = await common.getSign(axios, {
            ...options,
            functionId,
            body: JSON.stringify(body),
            uuid: uuid || cookies.__jdu,
            client,
            clientVersion
        })

        sign1.split('&').map(kv => {
            let kk = kv.split('=')
            params[kk[0]] = kk[1]
        })

        return {
            params,
            body: JSON.stringify(body)
        }
    },
    /**
     * 由于某些缘由，不对外公布具体签名算法，在线上提供仅供该asm项目使用
     * 该接口仅作签名使用，不留存信息
     * 
     * @param {*} axios 
     * @param {*} options 
     * @returns 
     */
    getSign: async (axios, options) => {

        let enableRemoteSignApi = !!options['enableRemoteSignApi']
        console.log('enableRemoteSignApi', enableRemoteSignApi)

        if (!enableRemoteSignApi) {
            return ''
        }
        console.log('警告！！！【正在提交远程签名】，如你不清楚此处提交为了做什么，或者不信任此处代码，请不要使用本工具')
        console.log('使用:请注释掉上面return所在三行, 或者--enableRemoteSignApi true, 禁用: 取消注释或者删除enableRemoteSignApi配置')

        const { functionId, body, uuid, client, clientVersion } = options
        let { data } = await axios.request({
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            jar: null,
            url: `http://jdsignapi.forisy.com/getSignFromJni?key=useasmkeyjdsign`,
            method: 'POST',
            data: transParams({
                str: functionId,
                str2: body,
                str3: uuid,
                str4: client,
                str5: clientVersion
            })
        })
        return data
    },
    getFp: (axios, options) => {
        // get: function(a) {
        //     var b = 1 * m
        //       , c = [];
        //     "ie" == g && 7 <= b ? (c.push(n),
        //     c.push(e),
        //     y = y + ",'userAgent':'" + t(n) + "','language':'" + e + "'",
        //     this.browserRedirect(n)) : (c = this.userAgentKey(c),
        //     c = this.languageKey(c));
        //     c.push(g);
        //     c.push(m);
        //     c.push(r);
        //     c.push(k);
        //     y = y + ",'os':'" + r + "','osVersion':'" + k + "','browser':'" + g + "','browserVersion':'" + m + "'";
        //     c = this.colorDepthKey(c);
        //     c = this.screenResolutionKey(c);
        //     c = this.timezoneOffsetKey(c);
        //     c = this.sessionStorageKey(c);
        //     c = this.localStorageKey(c);
        //     c = this.indexedDbKey(c);
        //     c = this.addBehaviorKey(c);
        //     c = this.openDatabaseKey(c);
        //     c = this.cpuClassKey(c);
        //     c = this.platformKey(c);
        //     c = this.hardwareConcurrencyKey(c);
        //     c = this.doNotTrackKey(c);
        //     c = this.pluginsKey(c);
        //     c = this.canvasKey(c);
        //     c = this.webglKey(c);
        //     b = this.x64hash128(c.join("~~~"), 31);
        //     return a(b)
        // },

        let fp = crypto.createHash("md5").update(options.user + '573.9', "utf8").digest("hex").substr(4, 16)
        console.log('fp', fp)
        return fp
    }
}
module.exports = common