var common = {
    reqApi: async (axios, options) => {
        const { url, data } = options
        let result = await axios.request({
            headers: {
                'Host': 'lop-proxy.jd.com',
                'lop-dn': 'jingcai.jd.com',
                'biz-type': 'service-monitor',
                'app-key': 'jexpress',
                'access': 'H5',
                'content-type': 'application/json;charset=utf-8',
                'clientinfo': '{"appName":"jingcai","client":"m"}',
                'accept': 'application/json, text/plain, */*',
                'jexpress-report-time': Date.now() + '',
                'x-requested-with': 'XMLHttpRequest',
                'source-client': '2',
                'appparams': '{"appid":158,"ticket_type":"m"}',
                'version': '1.0.0',
                'origin': 'https://jingcai-h5.jd.com',
                'sec-fetch-site': 'same-site',
                'sec-fetch-mode': 'cors',
                'sec-fetch-dest': 'empty',
                'accept-language': 'zh-CN,zh;q=0.9',
                "referer": `https://jingcai-h5.jd.com/index.html?hasTabBar=true&source=appSearch`,
            },
            url: url,
            method: 'post',
            data: data
        })
        return result
    }
}
module.exports = common