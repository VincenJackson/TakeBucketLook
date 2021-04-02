
const { reqApiSign } = require('../api/client')
// 京东拍卖
var jingdongpaimai = {
    doTask: async (axios, options) => {
        let data = await reqApiSign(axios, {
            ...options,
            functionId: 'userDailySign',
            body: {}
        })
        if (data.code === 0) {
            if (data.data?.result) {
                console.log('签到成功', '积分', data.data.scoreToday || 0)
            } else {
                console.error('今天已签到')
            }
        } else {
            console.error('签到失败', data)
        }
    }
}
module.exports = jingdongpaimai