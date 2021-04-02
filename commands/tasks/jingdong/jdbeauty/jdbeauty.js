var WebSocketClient = require('websocket').client;
const { reqApiSign } = require('../api/client')
var jdbeauty = {
    connection: undefined,
    heart: undefined,
    meetingplace_view: false,
    shop_view: false,
    add_product_view: false,
    get_benefit: false,
    to_exchange: true,
    time: 0,
    cccc: undefined,
    token: '',
    coins: 0,
    doMessage: async (axios, options, message) => {
        if (message !== 'pong') {
            message = JSON.parse(message)
            if (message.action === 'check_up') {
                let n = message.data.mettingplace_count - message.data.meetingplace_view
                if (n > 0) {
                    console.info('浏览会场任务进度', `${message.data.meetingplace_view}/${message.data.mettingplace_count}`)
                }
                while (n > 0) {
                    console.info('第', n, '次')
                    jdbeauty.sendData(JSON.stringify({ "msg": { "type": "action", "args": { "source": 1 }, "action": "meetingplace_view" } }))
                    await new Promise((resolve, reject) => setTimeout(resolve, 2 * 1000))
                    n--
                }
                message.data.check_up.map(c => {
                    if (c.receive_status === 0) {
                        jdbeauty.sendData(JSON.stringify({ "msg": { "type": "action", "args": { "check_up_id": c.id }, "action": "check_up_receive" } }))
                    }
                })
                jdbeauty.daily_shop_follow_times = message.data.shop_view.length
                jdbeauty.daily_product_add_times = message.data.product_adds.length
                jdbeauty.meetingplace_view = true
            } else if (message.action === 'get_user') {
                console.info('用户已有美妆币', message.data.coins)
                jdbeauty.coins = message.data.coins
            } else if (message.action === 'to_exchange') {
                if (message.code != 200) {
                    jdbeauty.to_exchange = false
                    console.error(message.msg)
                }
            } else if (message.action === 'get_benefit') {
                let d = message.data.find(d => d.id === 7)
                let n = d.day_limit - d.day_exchange_count
                while (n > 0) {
                    if (!jdbeauty.to_exchange) {
                        console.error('已达单日兑换上限')
                        break
                    }
                    console.info('开始兑换京豆')
                    jdbeauty.sendData(JSON.stringify({ "msg": { "type": "action", "args": { "benefit_id": 7 }, "action": "to_exchange" } }))
                    await new Promise((resolve, reject) => setTimeout(resolve, 3 * 1000))
                    n -= 1
                }
                jdbeauty.get_benefit = true
            } else if (message.action === 'sign_in') {
                jdbeauty.sendData(JSON.stringify({ "msg": { "action": "write", "type": "action", "args": { "action_type": 1, "channel": 2, "source_app": 2 } } }))
            } else if (message.action === 'shop_products') {
                if (jdbeauty.daily_shop_follow_times < 5) {
                    for (let shop of message.data.shops) {
                        jdbeauty.sendData(JSON.stringify({ "msg": { "type": "action", "args": { "shop_id": shop.id }, "action": "shop_view" } }))
                        await new Promise((resolve, reject) => setTimeout(resolve, 3 * 1000))
                        jdbeauty.sendData(JSON.stringify({ "msg": { "action": "write", "type": "action", "args": { "action_type": 6, "channel": 2, "source_app": 2, "vender": shop.vender_id + '' } } }))
                        await new Promise((resolve, reject) => setTimeout(resolve, 1 * 1000))
                        await require('../api/shop').DelShopFav(axios, {
                            ...options,
                            referer: 'https://shop.m.jd.com/',
                            params: {
                                shopId: shop.jd_shop_id
                            }
                        })
                    }
                }
                jdbeauty.shop_view = true
                if (jdbeauty.daily_product_add_times < 5) {
                    for (let product of message.data.products) {
                        jdbeauty.sendData(JSON.stringify({ "msg": { "type": "action", "args": { "add_product_id": product.id }, "action": "add_product_view" } }))
                        await new Promise((resolve, reject) => setTimeout(resolve, 3 * 1000))
                        jdbeauty.sendData(JSON.stringify({ "msg": { "action": "write", "type": "action", "args": { "action_type": 9, "channel": 2, "source_app": 2, "vender": product.shop_id + '' } } }))
                        jdbeauty.sendData(JSON.stringify({ "msg": { "action": "write", "type": "action", "args": { "action_type": 5, "channel": 2, "source_app": 2, "vender": product.shop_id + '' } } }))
                    }
                }
                jdbeauty.add_product_view = true
                jdbeauty.sendData(JSON.stringify({
                    "msg": {
                        "type": "action",
                        "args": { "source": 1 },
                        "action": "_init_"
                    }
                }))
            }
        }
    },
    isvObfuscator: async (axios, options) => {
        let data = await reqApiSign(axios, {
            ...options,
            functionId: 'isvObfuscator',
            body: { "id": "", "url": "https://xinruimz-isv.isvjcloud.com" }
        })
        if (data.code === '0') {
            return data.token
        } else {
            console.error(data.message)
        }
    },
    auth: async (axios, options) => {
        let { data } = await axios.request({
            headers: {
                "Cookie": "",
                "X-Requested-With": "com.jingdong.app.mall"
            },
            jar: null,
            url: `https://xinruimz-isv.isvjcloud.com/api/auth`,
            method: 'post',
            data: {
                "token": options.token,
                "source": "01"
            }
        })
        return data.access_token
    },
    ping: () => {
        jdbeauty.connection.sendUTF('ping')
    },
    sendData: (data) => {
        jdbeauty.connection.sendUTF(data)
    },
    connect: async (axios, options) => {
        return new Promise((resolve, reject) => {
            var client = new WebSocketClient();
            client.on('connectFailed', function (error) {
                console.log('Connect Error: ' + error.toString());
                jdbeauty.time = 30
                resolve()
            });
            client.on('connect', function (connection) {
                console.log('WebSocket client connected');
                jdbeauty.connection = connection
                jdbeauty.heart = setInterval(jdbeauty.ping, 20 * 1000)
                connection.on('error', function (error) {
                    console.log("Connection Error: " + error.toString());
                    jdbeauty.time = 30
                    resolve()
                });
                connection.on('close', function () {
                    console.log('echo-protocol Connection Closed');
                    jdbeauty.time = 30
                    resolve()
                });
                connection.on('message', function (message) {
                    if (!jdbeauty.connection) {
                        resolve()
                    }
                    if (message.type === 'utf8') {
                        // console.log("Received: '" + message.utf8Data + "'");
                        jdbeauty.doMessage(axios, options, message.utf8Data)
                    }
                });
                jdbeauty.sendData(JSON.stringify({
                    "msg": {
                        "type": "action",
                        "args": { "source": 1 },
                        "action": "_init_"
                    }
                }))
                jdbeauty.sendData(JSON.stringify({ "msg": { "type": "action", "args": {}, "action": "sign_in" } }))
                jdbeauty.sendData(JSON.stringify({ "msg": { "type": "action", "args": {}, "action": "shop_products" } }))
                jdbeauty.sendData(JSON.stringify({ "msg": { "type": "action", "args": {}, "action": "get_benefit" } }))

                jdbeauty.cccc = setInterval(() => {
                    if (jdbeauty.time >= 30) {
                        resolve()
                    }
                    if (jdbeauty.add_product_view && jdbeauty.shop_view && jdbeauty.meetingplace_view && jdbeauty.get_benefit) {
                        resolve()
                    }
                    jdbeauty.time += 2
                }, 2000)
            });
            client.connect(
                "wss://xinruimz-isv.isvjcloud.com/wss/?token=" + jdbeauty.token,
                '',
                'https://xinruimz-isv.isvjcloud.com',
                {
                    "user-agent": options.userAgent,
                    "cookie": options.cookies
                }
            )
        })
    },
    doTask: async (axios, options) => {
        let token = await jdbeauty.isvObfuscator(axios, options)
        if (!token) {
            console.error('没有提供isvObfuscator返回的token, 跳过执行')
            return
        }

        jdbeauty.token = await jdbeauty.auth(axios, {
            ...options,
            token
        })

        console.log('jdbeauty.connect')
        await jdbeauty.connect(axios, options)
        if (jdbeauty.connection) {
            jdbeauty.connection.close()
        }
        jdbeauty.connection = null
        clearInterval(jdbeauty.heart)
        clearInterval(jdbeauty.cccc)
    }
}
module.exports = jdbeauty