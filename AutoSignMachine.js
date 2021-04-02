const yargs = require('yargs/yargs')
const os = require('os')
const path = require('path')
const fs = require('fs-extra')
const log = require('./utils/log')
const dotenv = require("dotenv")

function registerEvn(argvs) {

  // 注入全局环境变量，可用于通知参数等
  let env_file = argvs.env_file ? argvs.env_file : path.join(__dirname, '.env')
  if (fs.existsSync(env_file)) {
    console.info('加载env文件', env_file)
    dotenv.config({
      path: env_file
    })
  }

  // 下面的行为将使用命令行参数覆盖已有环境变量参数
  if (argvs.notify_sckey) {
    // Server酱 SCKEY
    process.env['notify_sckey'] = argvs.notify_sckey
  }

  if (argvs.notify_sctkey) {
    // Server酱 SCKEY
    process.env['notify_sctkey'] = argvs.notify_sctkey
  }

  if (argvs.notify_dingtalk_token) {
    // dingtalk access_token
    process.env['notify_dingtalk_token'] = argvs.notify_dingtalk_token
  }

  // see https://api.telegram.org/bot[[argvs.notify_tele_bottoken]]/getUpdates
  // see @getuserID
  if (argvs.notify_tele_bottoken && argvs.notify_tele_chatid) {
    // 机器人TOKEN
    process.env['notify_tele_bottoken'] = argvs.notify_tele_bottoken
    // CHAT ID
    process.env['notify_tele_chatid'] = argvs.notify_tele_chatid
    // api url
    process.env['notify_tele_url'] = argvs.notify_tele_url || 'https://api.telegram.org'
  }

  if (argvs.notify_pushplus_token) {
    // pushplus
    process.env['notify_pushplus_token'] = argvs.notify_pushplus_token
  }

  // 企业微信
  if (argvs.notify_wechat_corpid && argvs.notify_wechat_corpsecret && argvs.notify_wechat_agentld) {
    process.env['notify_wechat_corpid'] = argvs.notify_wechat_corpid
    process.env['notify_wechat_corpsecret'] = argvs.notify_wechat_corpsecret
    process.env['notify_wechat_agentld'] = argvs.notify_wechat_agentld
  }

  // 企业微信群机器人
  // see https://work.weixin.qq.com/api/doc/90000/90136/91770
  if (argvs.notify_wechat_bottoken) {
    process.env['notify_wechat_bottoken'] = argvs.notify_wechat_bottoken
  }

  if ('verbose' in argvs) {
    process.env['asm_verbose'] = 'true'
  }

  // 统一环境变量
  if ('TENCENTCLOUD_RUNENV' in process.env && process.env.TENCENTCLOUD_RUNENV === 'SCF') {  // 腾讯云函数
    process.env['asm_func'] = 'true'
    process.env['asm_code_dir'] = process.env.USER_CODE_ROOT.replace(/[\/|\\]$/gi, "") + '/'
    process.env['asm_save_data_dir'] = path.join('/tmp', '.AutoSignMachine')
  } else if ('FC_FUNC_CODE_PATH' in process.env) { // 阿里云函数计算 
    process.env['asm_func'] = 'true'
    process.env['asm_code_dir'] = process.env.FC_FUNC_CODE_PATH.replace(/[\/|\\]$/gi, "") + '/'
    process.env['asm_save_data_dir'] = path.join('/tmp', '.AutoSignMachine')
  } else {
    process.env['asm_func'] = 'false'
    process.env['asm_code_dir'] = ''
    process.env['asm_save_data_dir'] = path.join(os.homedir(), '.AutoSignMachine')
  }
}
/**
 * 命令执行入口
 */
var AutoSignMachine_Run = (argv) => {
  argv = (argv || process.argv).slice(2)

  let argvs = yargs(argv)
    .commandDir('commands')
    .demand(1)
    .config('config', 'JSON配置文件路径')
    .help()
    .alias('h', 'help')
    .locale('en')
    .showHelpOnFail(true, '使用--help查看有效选项')
    .epilog('copyright 2020 LunnLew')
    .argv;

  registerEvn(argvs)

}
module.exports = {
  run: AutoSignMachine_Run
}