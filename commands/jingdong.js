
const path = require('path')
const { buildArgs } = require('../utils/util')
const { default: PQueue } = require('p-queue');

exports.command = 'jingdong'

exports.describe = 'jingdong任务'

exports.builder = function (yargs) {
  return yargs
    .option('user', {
      describe: '用于标识用户',
      default: '',
      type: 'string'
    })
    .option('cookies', {
      describe: '签到cookies',
      default: '',
      type: 'string'
    })
    .help()
    .showHelpOnFail(true, '使用--help查看有效选项')
    .epilog('copyright 2020 LunnLew');
}

exports.handler = async function (argv) {
  var command = argv._[0]
  let accounts = buildArgs(argv)
  console.info('总账户数', accounts.length)
  let concurrency = 1
  let queue = new PQueue({ concurrency });
  for (let account of accounts) {
    queue.add(async () => {
      let { scheduler } = require('../utils/scheduler')
      await require(path.join(__dirname, 'tasks', command, command)).start({
        cookies: account.cookies,
        options: account
      }).catch(err => console.info("jingdong任务:", err))
      let hasTasks = await scheduler.hasWillTask(command, {
        tryrun: 'tryrun' in argv,
        taskKey: account.user,
        concurrency: 2,
        tasks: account.tasks
      })
      if (hasTasks) {
        await scheduler.execTask(command, account.tasks).catch(err => console.error("jingdong任务:", err)).finally(() => {
          if (Object.prototype.toString.call(scheduler.taskJson.rewards) === '[object Object]') {
            console.info('今日获得奖品信息统计')
            for (let type in scheduler.taskJson.rewards) {
              console.info(`\t`, type, scheduler.taskJson.rewards[type])
            }
          }
          console.info('当前任务执行完毕！')
        })
      } else {
        console.info('暂无可执行任务！')
      }
    })
  }
  await queue.onIdle()
}