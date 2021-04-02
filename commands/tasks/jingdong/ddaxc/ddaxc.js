const game_eliminate = require('../api/game_eliminate')

var ddaxc = {
    doTask: async (axios, options) => {
        game_eliminate.config = {
            "origin": `https://prodev.m.jd.com`,
            "referer": `https://prodev.m.jd.com/mall/active/448KZiLTkqbPBuhS7nK5rJsrLHGD/index.html`,
            "gamepath": "eliminate_jd",
            "activeId": "A_112790_R_1_D_20201028",
            "refid": "wojing",
            "tttparams": "3X698ybmEeyJnTGF0IjoiMzAuNjIwNzIiLCJnTG5nIjoiMTA0LjE0MDE3In90=",
        }
        await game_eliminate.play(axios, options)
    }
}
module.exports = ddaxc