const { w, getFp } = require("../sign/common")
const moment = require('moment')
const CryptoJS = require("crypto-js");

var common = {
  algo: undefined,
  request_algo: async (axios, options) => {
    const { fp, appId, timestamp } = options
    let { data } = await axios.request({
      headers: {
        "referer": `https://wqsd.jd.com/`,
        "X-Requested-With": "com.jd.pingou",
      },
      url: `https://cactus.jd.com/request_algo?` + w(),
      method: 'post',
      data: {
        version: "1.0",
        fp,
        appId,
        timestamp,
        platform: "web",
        expandParams: ""
      }
    })
    return data.data.result
  },
  buildh5st: async (axios, options) => {
    const { time, params } = options
    let _timestamp = moment(time).format('YYYYMMDDHHmmssSSS')
    let _fingerprint = getFp(axios, options)
    let _appId = '10001'

    if (!common.algo) {
      common.algo = await common.request_algo(axios, {
        ...options,
        fp: _fingerprint,
        appId: _appId,
        timestamp: _timestamp
      })
    }

    let { tk, algo } = common.algo

    let _token = tk
    let _genKey = new Function("return ".concat(algo))()
    let r = _genKey(_token, _fingerprint, _timestamp, _appId, CryptoJS).toString()
    let t = params
    let a = Array.prototype.map.call(t, function (e) {
      return e.key + ":" + e.value
    }).join("&")
    let e = CryptoJS.HmacSHA256(a, r).toString(CryptoJS.enc.Hex)

    let h5st = ["".concat(_timestamp), "".concat(_fingerprint), "".concat(_appId), "".concat(_token), "".concat(e)].join(";")

    let _stk = Array.prototype.map.call(t, function (e) {
      return e.key
    }).join(",")

    return {
      _timestamp,
      h5st,
      _stk
    }
  }
}
module.exports = common