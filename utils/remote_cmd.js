const axios = require('axios');
axios.defaults.timeout = 1000;

/**
 * 
 * @param {*} fnc 函数
 * @param {*} minute 超时时长分钟
 * @param {*} relay 延时秒数
 * @returns 
 */
let retry = (fnc, minute = 5, relay = 5) => {
    return new Promise((reslove, reject) => {
        let __second = 0
        let __start = new Date().getTime()
        let __fn = () => {
            fnc().then(res => {
                reslove(res)
            }).catch(e => {
                setTimeout(() => {
                    let __end = new Date().getTime()
                    __second += Math.max(relay, Math.floor((__end - __start) / 1000))
                    __start = __end
                    __second <= (minute * 60) ? __fn() : reslove(false)
                }, relay * 1000)
            })
        }
        __fn()
    })
}

var remote_cmd = {
    /**
     * 发送给机器人的消息
     * @param {*} message 
     */
    send_tele_notify: async (message) => {
        await axios({
            url: `${process.env.notify_tele_url}/bot${process.env.notify_tele_bottoken}/`,
            method: 'post',
            data: {
                "method": "sendMessage",
                "chat_id": process.env.notify_tele_chatid,
                "text": `${message}`,
            }
        }).catch(err => console.log('发送失败'))
    },
    /**
     * 发送给机器人的指令
     * @param {*} message 
     */
    send_tele_cmd: async (message, cmd) => {
        await axios({
            url: `${process.env.notify_tele_url}/bot${process.env.notify_tele_bottoken}/`,
            method: 'post',
            data: {
                "method": "sendMessage",
                "chat_id": process.env.notify_tele_chatid,
                "text": `${message},请按格式[ ${cmd}:<cmd-body> ]回复内容，例如 ${cmd}:123456`,
            }
        }).catch(err => console.log('发送失败'))
    },
    /**
     * 用户发送给机器人所对应指令的回复内容
     * 一般格式
     * 请求的:  [cmd]  =>  用户需要回复的:  [cmd:<cmd-body>]
     * @param {*} cmd 指令
     * @returns 
     */
    recieve_tele_cmd: async (cmd) => {
        if (!process.env.notify_tele_bottoken) {
            throw new Error('未配置notify_tele_bottoken')
        }
        var func = async () => {
            let { data } = await axios({
                timeout: 1000,
                headers: {
                    "Content-Type": 'application/json'
                },
                url: `${process.env.notify_tele_url}/bot${process.env.notify_tele_bottoken}/getUpdates`,
                method: 'get'
            })
            if (data.result.length) {
                let msg = data.result.filter(msg => msg['message'].text.indexOf(cmd) === 0).pop()
                if (msg !== undefined) {
                    return msg['message'].text.split(':').pop()
                }
            }
            throw new Error('未取得信息')
        }
        return await retry(func, 1, 3)
    }
}

module.exports = remote_cmd