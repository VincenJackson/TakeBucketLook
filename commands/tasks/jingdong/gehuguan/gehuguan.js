const game_eliminate = require('../api/game_eliminate')

var gehuguan = {
    doTask: async (axios, options) => {
        game_eliminate.config = {
            "origin": `https://game-cdn.moxigame.cn`,
            "referer": `https://game-cdn.moxigame.cn/eliminateJDGH/index.html`,
            "gamepath": "eliminate_jdhl",
            "activeId": "A_112790_R_3_D_20201102",
            "refid": "1",
            "tttparams": "MWcGReyJnTGF0IjoiMzAuNjIwNzIiLCJnTG5nIjoiMTA0LjE0MDE3In50="
        }

        await game_eliminate.play(axios, options)
    }
}
module.exports = gehuguan