const { w, transParams } = require("../sign/common")

const SecrectUtil = require('./game_eliminate_SecrectUtil')

// 爱消除类游戏执行流程
var game_eliminate = {
    config: {},
    token: async (axios, options) => {
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": game_eliminate.config.origin,
                "referer": game_eliminate.config.referer,
            },
            url: `https://jdjoy.jd.com/saas/framework/user/token?` + w({
                appId: 'dafbe42d5bff9d82298e5230eb8c3f79',
                client: 'm',
                url: 'pengyougou.m.jd.com',
            }),
            method: 'post'
        })
        return data.data
    },
    encrypt: async (axios, options) => {
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": game_eliminate.config.origin,
                "referer": game_eliminate.config.referer,
            },
            url: `https://jdhome.m.jd.com/saas/framework/encrypt/pin?appId=dafbe42d5bff9d82298e5230eb8c3f79`,
            method: 'post'
        })
        return data.data
    },
    login: async (axios, options) => {
        const { lkEPin, token } = options
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "referer": 'https://game-cdn.moxigame.cn/',
                "origin": 'https://game-cdn.moxigame.cn'
            },
            url: `https://jd.moxigame.cn/platform/active/role/login`,
            method: 'post',
            data: {
                "activeId": game_eliminate.config.activeId,
                "tttparams": game_eliminate.config.tttparams,
                "refid": game_eliminate.config.refid,
                "source": game_eliminate.config.refid,
                "lkEPin": lkEPin,
                "token": token,
                "collectionId": "294",
                "lng": "",
                "lat": "",
                "sid": "",
                "un_area": ""
            }
        })
        return data
    },
    logincheck: async (axios, options) => {
        const { logind } = options
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "referer": 'https://game-cdn.moxigame.cn/',
                "origin": 'https://game-cdn.moxigame.cn'
            },
            url: `https://jd.moxigame.cn/${game_eliminate.config.gamepath}/game/local/logincheck`,
            method: 'post',
            data: transParams({
                info: JSON.stringify(logind.info),
                'reqsId': 1,
            })
        })
        return data
    },
    getItemList: async (axios, options) => {
        const { logind, check, reqsId, Secrect } = options
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": game_eliminate.config.origin,
                "referer": game_eliminate.config.referer,
            },
            url: `https://jd.moxigame.cn/${game_eliminate.config.gamepath}/game/local/getItemList`,
            method: 'post',
            data: transParams(SecrectUtil.Encrypt({
                gameId: check.role.gameId,
                token: check.token,
                reqsId
            }, Secrect.encryptKey, Secrect.SecrectGameId))
        })
        return SecrectUtil.Decrypt(data['__data__'], data['__iv__'], Secrect.decryptKey)
    },
    beginLevel: async (axios, options) => {
        console.info('开始游戏关卡')
        const { logind, levelId, check, reqsId, Secrect } = options
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": game_eliminate.config.origin,
                "referer": game_eliminate.config.referer,
            },
            url: `https://jd.moxigame.cn/${game_eliminate.config.gamepath}/game/local/beginLevel`,
            method: 'post',
            data: transParams(SecrectUtil.Encrypt({
                gameId: check.role.gameId,
                token: check.token,
                levelId,
                reqsId
            }, Secrect.encryptKey, Secrect.SecrectGameId))
        })
        return SecrectUtil.Decrypt(data['__data__'], data['__iv__'], Secrect.decryptKey)
    },
    endLevel: async (axios, options) => {
        const { logind, levelId, check, score, Secrect } = options
        console.info('结束游戏关卡')

        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": game_eliminate.config.origin,
                "referer": game_eliminate.config.referer,
            },
            url: `https://jd.moxigame.cn/${game_eliminate.config.gamepath}/game/local/endLevel`,
            method: 'post',
            data: transParams(SecrectUtil.Encrypt({
                gameId: check.role.gameId,
                token: check.token,
                levelId,
                score
            }, Secrect.encryptKey, Secrect.SecrectGameId))
        })
        return SecrectUtil.Decrypt(data['__data__'], data['__iv__'], Secrect.decryptKey)
    },
    setsingleinfo: async (axios, options) => {
        const { logind, check, reqsId, Secrect, gameInfo } = options
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "origin": game_eliminate.config.origin,
                "referer": game_eliminate.config.referer,
            },
            url: `https://jd.moxigame.cn/${game_eliminate.config.gamepath}/game/local/setsingleinfo`,
            method: 'post',
            data: transParams(SecrectUtil.Encrypt({
                gameId: check.role.gameId,
                token: check.token,
                gameInfo: gameInfo,
                reqsId
            }, Secrect.encryptKey, Secrect.SecrectGameId))
        })
        return data
    },
    test: async (axios, options) => {
        let check = {}
        let cid = check.role.gameInfo.userinfo.max_cid + 1
        let Secrect = SecrectUtil.init(check.token, check.role.gameId)
        console.info('当前关卡', Secrect)
        let d = {}
        console.log(SecrectUtil.Decrypt(d.__data__, d.__iv__, Secrect.encryptKey))
        console.log(check.role.gameInfo.userinfo.max_cid)
    },
    play: async (axios, options) => {
        console.info('登录游戏中')
        let lkEPin = await game_eliminate.encrypt(axios, options)
        let token = await game_eliminate.token(axios, options)
        do {
            console.info('查询游戏信息')
            let logind = await game_eliminate.login(axios, {
                ...options,
                lkEPin,
                token
            })
            let check = await game_eliminate.logincheck(axios, {
                ...options,
                logind
            })
            let cid = check.role.gameInfo.userinfo.max_cid + 1
            let Secrect = SecrectUtil.init(check.token, check.role.gameId)
            console.info('当前关卡', cid)

            let reqsId = 1
            let s = await game_eliminate.getItemList(axios, {
                ...options,
                logind,
                check,
                Secrect,
                reqsId
            })

            if (s.items['8003'] < 5) {
                console.error('体力不足，退出')
                break
            }

            reqsId++
            await game_eliminate.beginLevel(axios, {
                ...options,
                logind,
                check,
                Secrect,
                reqsId,
                levelId: check.role.gameInfo.userinfo.max_cid + 1
            })

            reqsId++
            let gameInfo = {
                userinfo: check.role.gameInfo.userinfo
            }

            await game_eliminate.setsingleinfo(axios, {
                ...options,
                logind,
                check,
                Secrect,
                reqsId,
                gameInfo
            })

            await new Promise((resolve, reject) => setTimeout(resolve, 30 * 1000))

            let score = parseInt(((check.role.gameInfo.userinfo.max_cid + 1) * 2400) + Math.random() * 1000)

            console.info('提交分数', score)
            let d = await game_eliminate.endLevel(axios, {
                ...options,
                logind,
                check,
                Secrect,
                score,
                levelId: check.role.gameInfo.userinfo.max_cid + 1
            })

            let cc = d.allLevels.find(l => l.id === cid + '')
            console.info('当前关卡星星数', cc.star3Award)
            if (cc && cc.star3Award == 3) {
                console.info('开始进入下一关卡')
                await new Promise((resolve, reject) => setTimeout(resolve, 10 * 1000))
            } else {
                console.error('游戏失败退出')
                break
            }

        } while (true)

    }
}
module.exports = game_eliminate