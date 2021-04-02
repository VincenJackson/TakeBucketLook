
const { reqApiNoSign } = require('./api/client')
const moment = require('moment')

var JDUserInfo = {
    getJingBeanBalanceDetail: async (axios, options) => {
        const { page } = options
        let data = await reqApiNoSign(axios, {
            ...options,
            functionId: 'getJingBeanBalanceDetail',
            body: { "page": page + '', "pageSize": "20" }
        })
        return data.detailList
    },
    getUserInfo: async (axios, options) => {
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "referer": 'https://wqs.jd.com/'
            },
            url: `https://wq.jd.com/user/info/QueryJDUserInfo`,
            method: 'get',
            params: {
                sceneid: 80027,
                sceneval: '2',
                g_login_type: '1',
                g_ty: 'ls',
                _: Date.now(),
            }
        })
        console.info('用户总京豆', data.base.jdNum)
    },
    doTotal: async (axios, options) => {
        let list = []
        let list1 = []
        let page = 1
        let today = moment().date()
        let last1 = moment().subtract(1, 'days').date()
        let last2 = moment().subtract(2, 'days').date()
        do {
            let listnext = await JDUserInfo.getJingBeanBalanceDetail(axios, {
                ...options,
                page
            })
            if (!listnext || listnext.length <= 0) {
                break
            }

            let todaylist = listnext.filter(l => moment(l.date).date() === today)
            list = [...list, ...todaylist]

            let last1list = listnext.filter(l => moment(l.date).date() === last1)
            list1 = [...list1, ...last1list]

            if (last1list.length < listnext.length) {
                let last2list = listnext.filter(l => moment(l.date).date() === last2)
                if (last2list.length > 0) {
                    break
                }
            }
            await new Promise((resolve, reject) => setTimeout(resolve, 1 * 1000))
            page++
        } while (true)

        let last_total = list1.filter(l => parseInt(l.amount) >= 0).reduce((total, cur) => {
            return total + parseInt(cur.amount);
        }, 0)
        let today_total = list.filter(l => parseInt(l.amount) >= 0).reduce((total, cur) => {
            return total + parseInt(cur.amount);
        }, 0)
        console.notify('今日获得京豆信息统计')
        console.notify('昨日获得京豆', last_total, '今日获得京豆', today_total)
    }
}
module.exports = JDUserInfo