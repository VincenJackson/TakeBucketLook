const { reqApiNoSign } = require("../api/client")
var shopmember = {
  jd_shop_member: async (axios, options) => {
    const { shop } = options
    let data = await reqApiNoSign(axios, {
      ...options,
      appid: 'jd_shop_member',
      functionId: 'bindWithVender',
      headers: {
        "Referer": "https://shopmember.m.jd.com/shopcard",
      },
      method: 'get',
      params: {
        clientVersion: '9.2.0',
        client: 'H5',
        uuid: '88888'
      },
      body: {
        "venderId": shop.venderId || shop.shopId,
        "shopId": shop.shopId,
        "bindByVerifyCodeFlag": 1,
        "registerExtend": {},
        "writeChildFlag": 0,
        "channel": 930
      }
    })
    console.info(data)
  }
}
module.exports = shopmember