var transParams = (data) => {
    let params = new URLSearchParams();
    for (let item in data) {
        params.append(item, data['' + item + '']);
    }
    return params;
};

// https://ylc.m.jd.com/?ext=1101
var gamePlay = {
    queryFollow: async (axios, options) => {
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "referer": `https://ylc.m.jd.com/?ext=1101`,
            },
            url: `https://ylc.m.jd.com/follow/queryFollow`,
            method: 'post',
            data: { "headers": { "X-Requested-With": "XMLHttpRequest" } }
        })
        return data.data.followType
    },
    // 首次关注送1京豆
    firstfllow: async (axios, options) => {
        let followType = await gamePlay.queryFollow(axios, options)
        if (followType === 1) {
            console.info('首次关注送1京豆')
            let { data } = await axios.request({
                headers: {
                    "user-agent": options.userAgent,
                    "referer": `https://ylc.m.jd.com/?ext=1101`,
                },
                url: `https://ylc.m.jd.com/follow/operation`,
                method: 'post',
                data: transParams({
                    followType: 1
                })
            })
            console.info(data)
        }
    },
    beat: async (axios, options) => {
        const { game } = options
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "referer": `https://joy.m.jd.com/game/` + game.gameId,
            },
            url: `https://joy.m.jd.com/game/beat`,
            method: 'post',
            data: {
                'gameId': game.gameId,
                'gameName': game.name,
                'loginNum': 2,
                'timeInterval': 30
            }
        })
        console.log(data.returnMsg)
    },
    getTasksState: async (axios, options) => {
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "referer": `https://ylc.m.jd.com/?ext=1101`,
            },
            url: `https://ylc.m.jd.com/game/getTasks?t=` + Date.now(),
            method: 'get'
        })
        return data.data[0].progress
    },
    getTasklinkedGames: async (axios, options) => {
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
            },
            url: `https://ylc.m.jd.com/game/getTasklinkedGames?t=` + Date.now(),
            method: 'post',
            data: transParams({
                type: 1
            })
        })
        return data.data.finishUnionGames
    },
    login: async (axios, options) => {
        const { game } = options
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
            },
            url: `https://joy.m.jd.com/gameSlide/login`,
            method: 'post',
            data: transParams({
                gameId: game.gameId
            })
        })
    },
    promptboxShow: async (axios, options) => {
        const { game } = options
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
            },
            url: `https://joy.m.jd.com/game/promptboxShow/` + game.gameId,
            method: 'post',
            data: transParams({
                gameId: game.gameId
            })
        })
    },
    promptboxClose: async (axios, options) => {
        const { game } = options
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
            },
            url: `https://joy.m.jd.com/game/promptboxClose`,
            method: 'post',
            data: transParams({
                gameId: game.gameId,
                closeType: 2,
                activityId: 9202,
            })
        })
    },
    doTask: async (axios, options) => {
        await gamePlay.firstfllow(axios, options)

        console.info('玩任意3款游戏送1京豆')
        let progress = await gamePlay.getTasksState(axios, options)
        console.info('任务进度', `${progress.doneNum}/${progress.totalNum}`)
        let games = await gamePlay.getTasklinkedGames(axios, options)
        games = games.slice(progress.doneNum)
        let m = progress.totalNum - progress.doneNum
        let beatTime = 30
        if (m > 0) {
            for (let game of games) {
                console.info('开始玩', `${game.name}[${game.gameId}]`)
                m--
                let n = 3 * 60 / beatTime
                await gamePlay.login(axios, {
                    ...options,
                    game
                })
                await gamePlay.promptboxShow(axios, {
                    ...options,
                    game
                })
                await new Promise((resolve, reject) => setTimeout(resolve, 2 * 1000))
                await gamePlay.promptboxClose(axios, {
                    ...options,
                    game
                })
                while (n > 0) {
                    await gamePlay.beat(axios, {
                        ...options,
                        game
                    })
                    n--
                    if (n > 0) {
                        await new Promise((resolve, reject) => setTimeout(resolve, beatTime * 1000))
                    }
                }
                console.reward('京豆', 1)
                if (m <= 0) {
                    break
                }
            }
        } else {
            console.info('任务已完成')
        }
    }
}

module.exports = gamePlay