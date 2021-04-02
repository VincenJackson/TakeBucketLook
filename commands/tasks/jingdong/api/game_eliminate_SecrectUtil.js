const CryptoJS = require("crypto-js");
var SecrectUtil = {
    init: (t, e) => {
        let encryptKey = t.slice(8, 16) + t.slice(24, 32),
            encryptIv = t.slice(8, 16) + t.slice(24, 32);
        var i = CryptoJS.MD5(e).toString();
        let decryptKey = i.slice(0, 16),
            SecrectGameId = e
        return {
            encryptKey,
            encryptIv,
            decryptKey,
            SecrectGameId
        }
    },
    Encrypt: (t, encryptKey, SecrectGameId) => {
        "object" == typeof t && (t = JSON.stringify(t));
        var e = Math.floor(1e4 * Math.random()).toString()
            , i = CryptoJS.MD5(e).toString()
            , n = i.slice(0, 16)
            , s = CryptoJS.AES.encrypt(t, CryptoJS.enc.Utf8.parse(encryptKey), {
                iv: n ? CryptoJS.enc.Utf8.parse(n) : n,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
        return {
            __data__: s.toString(),
            __iv__: n,
            __id__: SecrectGameId
        }
    },
    Decrypt: (t, e, decryptKey) => {
        var i = CryptoJS.AES.decrypt(t, CryptoJS.enc.Utf8.parse(decryptKey), {
            iv: e ? CryptoJS.enc.Utf8.parse(e) : e,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }), n = JSON.parse(i.toString(CryptoJS.enc.Utf8));
        return n
    }
}
module.exports = SecrectUtil