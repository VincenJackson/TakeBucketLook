
const { Babel_Sign } = require('./Babel_Sign')

// https://pro.m.jd.com/mall/active/ZrH7gGAcEkY2gH8wXqyAPoQgk6t/index.html
var xiangbaoguan = {
    fetchenActKParams: async (axios, options) => {
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "referer": `https://pro.m.jd.com/`,
            },
            url: `https://pro.m.jd.com/mall/active/ZrH7gGAcEkY2gH8wXqyAPoQgk6t/index.html`,
            method: 'get'
        })
        let s = data.indexOf('window.__react_data__ =') + 23
        let e = data.indexOf('}());')
        return JSON.parse(data.substr(s, e - s)).activityData.floorList.find(f => f.template === "signIn").params
    },
    doTask: async (axios, options) => {
        let actKParams = await xiangbaoguan.fetchenActKParams(axios, options)
        await Babel_Sign(axios, {
            ...options,
            actKParams,
            activity: {
                "url": 'https://pro.m.jd.com/mall/active/ZrH7gGAcEkY2gH8wXqyAPoQgk6t/index.html',
                'name': "京东箱包馆"
            }
        })
    }
}
module.exports = xiangbaoguan