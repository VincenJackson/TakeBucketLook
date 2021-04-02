const { reqApiSign } = require('../api/client')

var Channel = {
    AddChannelFav: async (axios, options) => {
        const { channel } = options
        let data = await reqApiSign(axios, {
            ...options,
            functionId: 'userFollow',
            body: { "businessId": "1", "themeId": channel.channelId, "type": "1" }
        })
        if (data.code === '0') {
            console.info('取关成功', data.themeText)
        } else {
            console.error('取关失败', data)
        }
    },
    DelChannelFav: async (axios, options) => {
        const { channel } = options
        let data = await reqApiSign(axios, {
            ...options,
            functionId: 'userFollow',
            body: { "businessId": "1", "themeId": channel.channelId, "type": "0" }
        })
        if (data.code === '0') {
            console.info('取关成功', data.themeText)
        } else {
            console.error('取关失败', data)
        }
    }
}
module.exports = Channel