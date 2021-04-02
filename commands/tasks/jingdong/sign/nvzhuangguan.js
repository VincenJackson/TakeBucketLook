
const { Babel_Sign } = require('./Babel_Sign')

// https://pro.m.jd.com/mall/active/DpSh7ma8JV7QAxSE2gJNro8Q2h9/index.html
var nvzhuangguan = {
    fetchenActKParams: async (axios, options) => {
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "referer": `https://pro.m.jd.com/`,
            },
            url: `https://pro.m.jd.com/mall/active/DpSh7ma8JV7QAxSE2gJNro8Q2h9/index.html`,
            method: 'get'
        })
        let s = data.indexOf('window.__react_data__ =') + 23
        let e = data.indexOf('}());')
        return JSON.parse(data.substr(s, e - s)).activityData.floorList.find(f => f.template === "signIn").params
    },
    doTask: async (axios, options) => {
        let actKParams = await nvzhuangguan.fetchenActKParams(axios, options)
        await Babel_Sign(axios, {
            ...options,
            actKParams,
            activity: {
                "url": 'https://pro.m.jd.com/mall/active/DpSh7ma8JV7QAxSE2gJNro8Q2h9/index.html',
                'name': "京东女装馆"
            }
        })
    }
}
module.exports = nvzhuangguan