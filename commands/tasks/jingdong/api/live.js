const { reqApiSign } = require('../api/client')

const crypto = require("crypto");

var crypto_encrypt = function (data, key, iv) {
  var cipherEncoding = 'base64';
  var cipher = crypto.createCipheriv('aes-128-cbc', Buffer.from(key, 'utf-8'), Buffer.from(iv, 'utf-8'));
  cipher.setAutoPadding(true);
  return Buffer.concat([cipher.update(data), cipher.final()]).toString(cipherEncoding);
}

var crypto_decrypt = function (data, key, iv) {
  var clearEncoding = 'utf8';
  var cipherEncoding = 'base64';
  var decipher = crypto.createDecipheriv('aes-128-cbc', Buffer.from(key, 'utf-8'), Buffer.from(iv, 'utf-8'));
  decipher.setAutoPadding(true);
  return Buffer.concat([decipher.update(data, cipherEncoding), decipher.final()]).toString(clearEncoding);
}

var live = {
  liveauth: async (axios, options) => {
    const { livedata } = options
    let dd = {
      appId: "jd.mall",
      secretKey: "RYm2dMPMWD9AxYFk",
      groupId: livedata.liveId,
      clientType: "m",
      timestamp: (new Date).getTime(),
      pin: livedata.author.pin,
      random: Math.random().toString().slice(-6)
    }
    let content = crypto_encrypt(JSON.stringify(dd), 'RYm2dMPMWD9AxYFk', '0102030405060708')

    let { data } = await reqApiSign(axios, {
      ...options,
      functionId: 'liveauth',
      body: {
        "appId": "jd.mall",
        "content": content
      }
    })

    return data
  },
  liveDetailV910: async (axios, options) => {
    const { liveId } = options
    let { data } = await reqApiSign(axios, {
      ...options,
      functionId: 'liveDetailV910',
      body: { "direction": "0", "fromId": null, "isNeedVideo": 1, "liveId": liveId + '', "sku": null }
    })
    return {
      liveId: data.liveId,
      author: data.author
    }
  },
  liveChannelReportSwitchV912: async (axios, options) => {
    const { livedata } = options

    let data = await reqApiSign(axios, {
      ...options,
      functionId: 'liveChannelReportSwitchV912',
      body: { "authorId": livedata.author.authorId + '', "liveId": livedata.liveId + '', "origin": "17" }
    })

    console.log(data)
  },
  liveActivityV842: async (axios, options) => {
    const { livedata } = options
    let data = await reqApiSign(axios, {
      ...options,
      functionId: 'liveActivityV842',
      body: { "itemId": null, "liveId": livedata.liveId + '', "masterPin": null }
    })
    console.log(data)
  },
  liveChannelReportDataV912: async (axios, options) => {
    const { livedata, type, extra } = options
    let data = await reqApiSign(axios, {
      ...options,
      functionId: 'liveChannelReportDataV912',
      body: { "authorId": livedata.author.authorId + '', extra, "liveId": livedata.liveId + '', "type": type }
    })
    console.log(data)
  }
}
module.exports = live