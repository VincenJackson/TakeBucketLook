const { getFp, transParams } = require('../sign/common')
const { parseCookie } = require('../../../../utils/util')

var task7 = {
    setUserLinkStatus: async (axios, options) => {
        const { task, n } = options
        let cookies = parseCookie(options.cookies, ['3AB9D23F7A4B3C9B'])
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": "https://uua.jr.jd.com",
                "referer": 'https://uua.jr.jd.com/uc-fe-wxgrowing/moneytree/index/'
            },
            url: `https://ms.jr.jd.com/gw/generic/uc/h5/m/setUserLinkStatus?_=` + Date.now(),
            method: 'post',
            data: transParams({
                reqData: JSON.stringify({
                    "missionId": task.mid,
                    "pushStatus": 1,
                    "keyValue": n,
                    "riskDeviceParam": JSON.stringify({
                        "eid": cookies['3AB9D23F7A4B3C9B'],
                        "fp": getFp(axios, options),
                        // "sdkToken": "",
                        // "token": "",
                        // "jstub": "",
                        "appType": 4
                    })

                })
            })
        })

        if (data.resultCode === 0) {
            if (data.resultData.code === '200') {
                console.info('完成任务成功')
            } else {
                console.error('完成任务失败', data.resultData.msg)
            }
        } else {
            console.error('完成任务失败', data.resultMsg)
        }
    },
    doTask: async (axios, options) => {
        const { task } = options
        let time = task.mid === 667 ? 7 : (task.mid === 666 ? 6 : 1)
        let n = 0
        while (time > 0) {
            console.info('第', time, '次')
            await task7.setUserLinkStatus(axios, {
                ...options,
                task,
                n
            })
            time--
            n++
            if (time > 0) {
                await new Promise((resolve, reject) => setTimeout(resolve, 10 * 1000))
            } else {
                await new Promise((resolve, reject) => setTimeout(resolve, 2 * 1000))
            }
        }
    }
}

module.exports = task7