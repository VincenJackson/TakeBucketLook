const { scheduler } = require('../../../utils/scheduler')

// https://plogin.m.jd.com/login/login?appid=936

// 不含助力逻辑

// node 15 版本可用

var start = async (params) => {
  const { cookies, options } = params
  let init = async (request, savedCookies) => {
    await require('./init')(request, {
      ...params,
      cookies: savedCookies || cookies
    })
    return {
      request
    }
  }
  let taskOption = {
    init,
    cookies
  }

  options.userAgent = "jdapp;android;9.4.4;9;8363734343230333530323536353-53D2130343430303733373432666;network/wifi;model/VKY-AL00;addressid/2102328362;aid/e0f12a085626dbd1;oaid/00000000-0000-0000-0000-000000000000;osVer/28;appBuild/87076;partner/huawei;eufv/1;jdSupportDarkMode/0;Mozilla/5.0 (Linux; Android 9; VKY-AL00 Build/HUAWEIVKY-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/044942 Mobile Safari/537.36"

  // 日常签到
  await require('./sign/regTask')(scheduler, options, taskOption)

  // 种豆得豆
  await require('./plantBean/regTask')(scheduler, options, taskOption)

  // 疯狂的Joy
  await require('./crazy_joy/regTask')(scheduler, options, taskOption)

  // 宠物汪汪
  await require('./jdjoy/regTask')(scheduler, options, taskOption)

  // 幸福之家2021
  await require('./family2021/regTask')(scheduler, options, taskOption)

  // 玩游戏送京豆
  await require('./miniGame/regTask')(scheduler, options, taskOption)

  // 签到领现金
  await require('./cash_sign/regTask')(scheduler, options, taskOption)

  // 金果摇钱树
  await require('./moneytree/regTask')(scheduler, options, taskOption)

  // 京东到家
  await require('./daojia/regTask')(scheduler, options, taskOption)

  // 东东农场
  await require('./farm/regTask')(scheduler, options, taskOption)

  // 京东金贴
  await require('./JinTie/regTask')(scheduler, options, taskOption)

  // 京东直播
  await require('./live/regTask')(scheduler, options, taskOption)

  // 京东排行榜
  await require('./trumpActivity/regTask')(scheduler, options, taskOption)

  // 东东小窝
  await require('./jdhome/regTask')(scheduler, options, taskOption)

  // 东东萌宠
  await require('./petTown/regTask')(scheduler, options, taskOption)

  // 京东金融
  await require('./jinrong/regTask')(scheduler, options, taskOption)

  // 京奇世界
  await require('./jqworld/regTask')(scheduler, options, taskOption)

  // 东东爱消除
  await require('./ddaxc/regTask')(scheduler, options, taskOption)

  // 个护馆-个护爱消除
  await require('./gehuguan/regTask')(scheduler, options, taskOption)

  // 东东换新家
  await require('./newhome/regTask')(scheduler, options, taskOption)

  // 东东换新装
  await require('./ddhxz/regTask')(scheduler, options, taskOption)

  // 京东汽车
  await require('./car/regTask')(scheduler, options, taskOption)

  // 东东美丽颜究院
  await require('./jdbeauty/regTask')(scheduler, options, taskOption)

  // 东东工厂
  await require('./jdfactory/regTask')(scheduler, options, taskOption)

  // 天天加速
  await require('./dailySpeed/regTask')(scheduler, options, taskOption)

  // 领券中心-疯狂星期五
  await require('./happy5/regTask')(scheduler, options, taskOption)

  // 品牌闪购-闪购盲盒
  await require('./speedBuy/regTask')(scheduler, options, taskOption)

  // 京东秒杀-天天领红包(秒秒币)
  await require('./seckill/regTask')(scheduler, options, taskOption)

  // 京喜工厂
  await require('./dream_factory/regTask')(scheduler, options, taskOption)

  // 东东超市
  await require('./jdsupermarket/regTask')(scheduler, options, taskOption)

  // 积分签到
  await require('./jifen/regTask')(scheduler, options, taskOption)

  // 积分签到-玩一玩 5g超级盲盒
  await require('./isp5g/regTask')(scheduler, options, taskOption)

  // 京东玩一玩
  await require('./play/regTask')(scheduler, options, taskOption)

  // 京东APP-我的-寄件服务
  await require('./kuaidi/regTask')(scheduler, options, taskOption)

  // 京东APP-我的-京东会员-摇京豆
  await require('./vip_h5/regTask')(scheduler, options, taskOption)

  // 京东APP-首页-领京豆
  await require('./findBean/regTask')(scheduler, options, taskOption)

  // 京东APP-首页-玩一玩-拆盲盒
  await require('./chaimanghe/regTask')(scheduler, options, taskOption)

  // 京东APP-女装馆-盲盒
  await require('./piggybank/regTask')(scheduler, options, taskOption)

  // 京东APP-券后9.9-天天点点券
  await require('./coupon-necklace/regTask')(scheduler, options, taskOption)

  // 京东APP-手机换新-手机狂欢城
  await require('./carnivalcity/regTask')(scheduler, options, taskOption)

  // 京东APP-每日特价-天天砸金蛋
  await require('./zajindan/regTask')(scheduler, options, taskOption)

  // 用户京豆统计 结果推送
  if (!('asm_func' in process.env) || process.env.asm_func === 'false') {
    await scheduler.regTask('userBean', async (request) => {
      await require('./JDUserInfo').doTotal(request, options)
    }, {
      ...taskOption,
      startTime: 22 * 3600
    })
  }
}
module.exports = {
  start
}