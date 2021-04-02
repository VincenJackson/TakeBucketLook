const { w } = require('./common')

// 签到日历
// https://bean.m.jd.com/bean/signIndex.action
var task = {
    getSignState: async (axios, options) => {
        let params = {
            functionId: 'signBeanIndex',
            body: JSON.stringify({
                "monitor_refer": "",
                "rnVersion": "3.9",
                "fp": "-1",
                "shshshfp": "-1",
                "shshshfpa": "-1",
                "referUrl": "-1",
                "userAgent": "-1",
                "jda": "-1",
                "monitor_source": "bean_m_bean_index"
            }),
            appid: 'ld',
            client: 'null',
            clientVersion: 'null',
            networkType: 'null',
            osVersion: '',
            uuid: 'null'
        }
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "referer": 'https://bean.m.jd.com/'
            },
            url: `https://api.m.jd.com/client.action?` + w(params),
            method: 'get'
        })
        if (data.code === '0') {
            return data.data
        } else {
            console.error('获取签到日历状态失败', data)
            return {}
        }
    },
    doTask: async (axios, options) => {
        let data = await task.getSignState(axios, options)
        if (data.status === '2') {
            console.info('今天已签到', data.signCalendar.currentDate)
        } else if (data.status === '1') {
            let beanCount = (data.dailyAward || data.continuityAward || data.newUserAward).beanAward.beanCount
            console.info('签到成功', data.signCalendar.currentDate, '获得奖励 京豆+', beanCount)
            console.reward('京豆', beanCount)
        } else {
            console.error('签到失败', data)
        }
    }
}

module.exports = task