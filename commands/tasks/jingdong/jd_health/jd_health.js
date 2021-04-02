const { reqApi } = require('../api/api')
var jd_health = {
    jdh_queryFloor: async (axios, options) => {
        let { data } = await reqApi(axios, {
            ...options,
            functionId: "jdh_queryFloor",
            appid: "JDHAPP",
            body: { "pageSize": 15, "startFloor": 1, "pageId": "607a24f745524f5d9f7e8480e9a22dcf" },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'accept': 'application/json, text/plain, */*',
                'origin': 'https://hlc.m.jd.com',
                'referer': 'https://hlc.m.jd.com/',
            },
            params: {
                clientVersion: '2.1.7'
            }
        })
        return data
    },
    doTask: async (axios, options) => {
        let { floorDataList } = await jd_health.jdh_queryFloor(axios, options)
        let willtasks = floorDataList.filter(t => t.ext.type === 'HD_Floor_Health_Month_Doctor_Task_List')
        for (let task of willtasks) {
            for (let tt of task.items) {
                console.log(tt.items)
            }
        }
    }
}
module.exports = jd_health