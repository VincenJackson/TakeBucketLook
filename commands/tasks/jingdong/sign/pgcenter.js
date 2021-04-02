const { w } = require("../sign/common")
const { buildh5st } = require("../dream_factory/common")

var pgcenter = {
    sign: async (axios, options) => {
        let time = Date.now()
        let params = [
            { key: "sceneval", value: 2 },
            { key: "source", value: '' }
        ]
        let { _timestamp, _stk, h5st } = await buildh5st(axios, {
            ...options,
            params,
            time
        })
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "referer": 'https://wqs.jd.com/'
            },
            url: `https://wq.jd.com/pgcenter/sign/UserSignOpr?` + w({
                'sceneval': '2',
                source: '',
                '_stk': _stk,
                '_ste': 1,
                'h5st': h5st,
                '_': time,
                'sceneval': 2,
                'g_login_type': 1,
                'g_ty': 'ls'
            }),
            method: 'get'
        })
        if (data?.data?.signStatus === 0) {
            console.info('签到成功', '连续签到', data?.data?.cycleDays, '天')
        } else if (data?.data?.signStatus === 1) {
            console.info('今日已签到')
        } else {
            console.error('签到失败', data)
        }
    },
}
module.exports = pgcenter