
const { Babel_Sign } = require('./Babel_Sign')

// 京东校园-花YOUNG签到
var schoolyoung = {
    fetchenActKParams: async (axios, options) => {
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "referer": `https://pro.m.jd.com/`,
            },
            url: `https://pro.m.jd.com/mall/active/2QUxWHx5BSCNtnBDjtt5gZTq7zdZ/index.html`,
            method: 'get'
        })
        let s = data.indexOf('window.__react_data__ =') + 23
        let e = data.indexOf('}());')
        return JSON.parse(data.substr(s, e - s)).activityData.floorList.find(f => f.template === "signIn").signInfos.params
    },
    doTask: async (axios, options) => {
        let actKParams = await schoolyoung.fetchenActKParams(axios, options)
        await Babel_Sign(axios, {
            ...options,
            actKParams,
            activity: {
                "url": 'https://pro.m.jd.com/mall/active/2QUxWHx5BSCNtnBDjtt5gZTq7zdZ/index.html',
                'name': "京东校园-花YOUNG"
            }
        })
    }
}
module.exports = schoolyoung