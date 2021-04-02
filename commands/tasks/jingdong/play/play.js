const { w } = require("../sign/common")

var play = {
    playIndex: async (axios, options) => {
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": `https://funearth.m.jd.com`,
                "referer": `https://funearth.m.jd.com/babelDiy/Zeus/3BB1rymVZUo4XmicATEUSDUgHZND/index.html`,
            },
            url: `https://api.m.jd.com/client.action?` + w({
                functionId: 'playIndex',
                body: JSON.stringify({ "client": "app", "shareId": "", "playId": "", "source": "20" }),
                appid: 'wh5'
            }),
            method: 'get'
        })
        return data
    },
    playAction: async (axios, options) => {
        const { task } = options
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": `https://funearth.m.jd.com`,
                "referer": `https://funearth.m.jd.com/babelDiy/Zeus/3BB1rymVZUo4XmicATEUSDUgHZND/index.html`,
            },
            url: `https://api.m.jd.com/client.action?` + w({
                functionId: 'playAction',
                body: JSON.stringify({ "client": "app", "playId": task.playId + '', "type": "1" }),
                appid: 'wh5'
            }),
            method: 'get'
        })
        console.info('累计成就值', data.data?.achieve, '本次获得成就值', 50)
    },
    completeTasks: async (axios, options) => {
        let { hot: tasks } = await play.playIndex(axios, options)
        let willtask = tasks.filter(t => t.status === 0)
        for (let task of willtask) {
            await play.playAction(axios, {
                ...options,
                task
            })
            await new Promise((resolve, reject) => setTimeout(resolve, 3 * 1000))
        }
    }
}
module.exports = play