const { reqApiSign } = require('../api/client')
var cash_sign = {
    cash_homePage: async (axios, options) => {
        let data = await reqApiSign(axios, {
            ...options,
            functionId: 'cash_homePage',
            body: {}
        })
        if (data.code === 0) {
            if (data.data.bizCode === 0) {
                console.info('获取任务状态成功')
                return {
                    signedStatus: data.data.result.signedStatus,
                    tasks: data.data.result.taskInfos
                }
            } else {
                console.error('获取任务状态失败', data.data.bizMsg)
            }
        } else {
            console.error('获取任务状态失败', data)
        }
    },
    cash_sign: async (axios, options) => {
        let data = await reqApiSign(axios, {
            ...options,
            functionId: 'cash_sign',
            body: { "breakReward": 0, "inviteCode": null, "remind": 0, "type": 0 }
        })
        if (data.code === 0) {
            if (data.data.bizCode === 0) {
                console.info('签到得现金成功', data.data.result.signCash)
                console.reward('现金', data.data.result.signCash)
            } else {
                console.error('签到得现金失败', data.data.bizMsg)
            }
        } else {
            console.error('签到得现金失败', data)
        }
    },
    cash_doTask: async (axios, options) => {
        const { task } = options
        let data = await reqApiSign(axios, {
            ...options,
            functionId: 'cash_doTask',
            body: { "taskInfo": task.type == 7 ? 1 : (task.jump.params.skuId || task.desc), "type": task.type }
        })
        if (data.code === 0) {
            if (data.data.bizCode === 0) {
                console.info('任务进度', `${data.data.result.doTimes}/${data.data.result.times}`)
                return parseInt(data.data.result.times) - parseInt(data.data.result.doTimes)
            } else {
                console.error('任务完成失败', data.data.bizMsg)
                return 0
            }
        } else {
            console.error('任务完成失败', data)
            return 0
        }
    },
    cash_exchangePage: async (axios, options) => {
        let data = await reqApiSign(axios, {
            ...options,
            functionId: 'cash_exchangePage',
            body: {}
        })
        if (data.code === 0) {
            if (data.data.bizCode === 0) {
                data = {
                    cashNodeAmount: data.data.result.cashNodeAmount,
                    totalMoney: data.data.result.totalMoney
                }
                console.info('获取兑换信息成功', '已有现金', data.totalMoney, '起兑现金', data.cashNodeAmount)
                if (data.totalMoney >= data.cashNodeAmount) {
                    console.notify(`注意！！！ 你已到达最低可提现要求${data.totalMoney}/${data.cashNodeAmount}，可以去兑换现金啦`)
                }
                return data
            } else {
                console.error('获取兑换信息失败', data.data.bizMsg)
            }
        } else {
            console.error('获取兑换信息失败', data)
        }
    },
    doSign: async (axios, options) => {
        let data = await cash_sign.cash_homePage(axios, options)
        console.info('data.signedStatus', data.signedStatus)
        if (data.signedStatus === 2) {
            await cash_sign.cash_sign(axios, options)
        } else {
            console.error('今日已签到')
        }
    },
    SignedInfo: async (axios, options) => {
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "referer": 'https://wqs.jd.com/'
            },
            url: `https://wq.jd.com/double_sign/SignedInfo`,
            method: 'get',
            params: {
                sceneval: '2',
                g_login_type: '1',
                g_ty: 'ajax',
                _: Date.now(),
            }
        })
        console.log(data.data)
        return data.data
    },
    IssueReward: async (axios, options) => {
        let { data } = await axios.request({
            headers: {
                "user-agent": options.userAgent,
                "referer": 'https://wqs.jd.com/'
            },
            url: `https://wq.jd.com/double_sign/IssueReward`,
            method: 'get',
            params: {
                sceneval: '2',
                g_login_type: '1',
                g_ty: 'ajax',
                _: Date.now(),
            }
        })
        if (data.retCode === 0) {
            if (data.data?.jd_amount) {
                console.reawrd('现金', data.data?.jd_amount)
            }
        } else {
            console.error('领取双签奖励失败', data)
        }
    },
    doExchange: async (axios, options) => {
        // 累计到2.0元即可提现
        await cash_sign.cash_exchangePage(axios, options)
    },
    doTask: async (axios, options) => {
        let data = await cash_sign.cash_homePage(axios, options)
        let taskStatus_tasks = data.tasks.filter(t => t.finishFlag === 2)
        for (let task of taskStatus_tasks) {
            console.info(task.type, task.name)
            let ttt = task
            if ([3, 4, 5, 7, 16, 17].indexOf(ttt.type) !== -1) {
                let times = 0
                do {
                    times = await cash_sign.cash_doTask(axios, {
                        ...options,
                        task: ttt
                    })
                    if (times > 0) {
                        let newdata = await cash_sign.cash_homePage(axios, options)
                        ttt = newdata.tasks.find(t => t.type === ttt.type)
                        await new Promise((resolve, reject) => setTimeout(resolve, 3 * 1000))
                    }
                } while (times > 0)
            } else if ([15].indexOf(ttt.type) !== -1) {
                let { double_sign_status, jd_sign_status, jx_sign_status } = await cash_sign.SignedInfo(axios, options)

                if (!jd_sign_status) {
                    await cash_sign.doSign(request, options)
                }
                if (!jx_sign_status) {
                    await require('../sign/pgcenter').sign(request, options)
                }

                if (!double_sign_status) {
                    await cash_sign.IssueReward(axios, options)
                }

            } else
                console.error('未实现的任务', task.type, task.name)
        }
    }
}

module.exports = cash_sign