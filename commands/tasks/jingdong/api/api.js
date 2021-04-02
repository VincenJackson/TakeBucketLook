const { w } = require('../sign/common')
var client = {
  reqApi: async (axios, options) => {
    const { functionId, appid, body, params, headers, method } = options
    let { data } = await axios.request({
      headers: {
        "user-agent": options.userAgent,
        "X-Requested-With": "com.jingdong.app.mall",
        ...headers
      },
      url: `https://api.m.jd.com/api?` + w({
        functionId,
        appid,
        body: JSON.stringify(body || {}),
        t: Date.now(),
        // eu: '8363734343230333530323536353', // see options.userAgent
        // fv: '53D2130343430303733373432666' // see options.userAgent
        ...params
      }),
      method: method || 'get'
    })
    return data
  }
}
module.exports = client