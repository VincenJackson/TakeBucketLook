const { buildSignParams, reqApi, w } = require('../sign/common')
var client = {
  reqApiNoSign: async (axios, options) => {
    const { appid, functionId, body, params, method, headers } = options
    let { data } = await axios.request({
      headers: {
        "user-agent": options.userAgent,
        ...headers
      },
      url: `https://api.m.jd.com/client.action?` + w({
        functionId,
        body: JSON.stringify(body),
        appid: appid || 'ld',
        client: 'android',
        clientVersion: '9.4.4',
        networkType: 'wifi',
        osVersion: 9,
        uuid: '',
        ...params
      }),
      method: method || 'post'
    })
    return data
  },
  reqApiNoSignWh5: async (axios, options) => {
    const { appid, functionId, body, params, method, headers } = options
    let { data } = await axios.request({
      headers: {
        "user-agent": options.userAgent,
        ...headers
      },
      url: `https://api.m.jd.com/client.action?` + w({
        functionId,
        body: JSON.stringify(body),
        clientVersion: '1.0.0',
        client: 'wh5',
        ...params
      }),
      method: method || 'post'
    })
    return data
  },
  reqApiSign: async (axios, options) => {
    const { functionId, body } = options

    if (!options['enableRemoteSignApi']) {
      console.error('未启用远程签名模块，跳过')
      return
    }

    const params = await buildSignParams(axios, {
      options,
      functionId,
      body
    })
    let data = await reqApi(axios, {
      ...options,
      ...params
    })
    return data
  }
}
module.exports = client