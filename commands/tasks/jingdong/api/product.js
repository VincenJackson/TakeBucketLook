const { w } = require('../sign/common')
var product = {
    DelProductFav: async (axios, options) => {
        const { good } = options
        let params = {
            commId: good.sku + '',
            _: Date.now(),
            sceneval: 2,
            g_login_type: 1,
            g_ty: 'ls',
        }
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "referer": 'https://shop.m.jd.com/'
            },
            url: `https://wq.jd.com/fav/comm/FavCommDel?` + w(params),
            method: 'get'
        })
        if (data.iRet === 0) {
            console.info('取消收藏商品成功')
        } else {
            console.error('取消收藏商品失败', data)
        }
    },
}
module.exports = product