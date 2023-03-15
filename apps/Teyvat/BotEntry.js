/* eslint-disable camelcase */
import { getUrlJson } from '../../models/getUrlJson.js'
import { isFileExist } from '../../models/isFileExist.js'
import plugin from '../../../../lib/plugins/plugin.js'
import fs from 'fs'
import cfg from '../../../../lib/config/config.js'
import { getTeam } from './TeyvatTotalEntry.js'
import _ from 'lodash'
import gsCfg from '../../../genshin/model/gsCfg.js'

let ONE_PATH = `${process.cwd()}/plugins/FanSky_Qs/config/TeyvatConfig`
let DATA_PATH = `${process.cwd()}/plugins/FanSky_Qs/config/TeyvatConfig/TeyvatUrlJson.json`

if (!fs.existsSync(ONE_PATH)) {
  Bot.logger.info('>>>已创建TeyvatConfig文件夹')
  fs.mkdirSync(ONE_PATH)
}
if (!await isFileExist(DATA_PATH)) {
  fs.writeFileSync(DATA_PATH, '{}')
  logger.info(logger.magenta('>>>已创建TeyvatUrlJson.json配置文件'))
  logger.info(logger.magenta('>>>将在15s后初次写入必须JSON配置项'))
}
setTimeout(async () => {
  await FirstUpdataJSON()
}, 15000)

async function FirstUpdataJSON () {
  let PATH = DATA_PATH.replace(/\\/g, '/')
  let DATA_JSON = JSON.parse(fs.readFileSync(PATH))
  if (!DATA_JSON.CHAR_DATA || !DATA_JSON.HASH_TRANS || !DATA_JSON.CALC_RULES || !DATA_JSON.RELIC_APPEND) {
    const teyvatEntry = new BotEntry()
    let E = await teyvatEntry.getE()
    try {
      let WriteCHAR_DATAJson = await getUrlJson('https://cdn.monsterx.cn/bot/gspanel/char-data.json', E)
      let WriteHASH_TRANSJson = await getUrlJson('https://cdn.monsterx.cn/bot/gspanel/hash-trans.json', E)
      let WriteCALC_RULESJson = await getUrlJson('https://cdn.monsterx.cn/bot/gspanel/calc-rule.json', E)
      let WriteRELIC_APPENDJson = await getUrlJson('https://cdn.monsterx.cn/bot/gspanel/relic-append.json', E)
      DATA_JSON.CHAR_DATA = WriteCHAR_DATAJson
      DATA_JSON.HASH_TRANS = WriteHASH_TRANSJson
      DATA_JSON.CALC_RULES = WriteCALC_RULESJson
      DATA_JSON.RELIC_APPEND = WriteRELIC_APPENDJson
      fs.writeFileSync(PATH, JSON.stringify(DATA_JSON))
      logger.info(logger.magenta('>>>已写入CHAR_DATA、HASH_TRANS、CALC_RULES、RELIC_APPEND配置项 '))
      let list = cfg.masterQQ
      for (let userId of list) {
        await Bot.pickFriend(userId).sendMsg('>>>FanSky_Qs已写入提瓦特小助手JSON,若为空或失效请发送【#更新小助手配置】！')
      }
    } catch (err) {
      let list = cfg.masterQQ
      for (let userId of list) {
        await Bot.pickFriend(userId).sendMsg('>>>FanSky_Qs写入配置项失败，请检查错误信息！')
      }
      logger.info(logger.red('FanSky_Qs写入配置项失败，请检查错误信息！'))
      console.log(err)
    }
  }
}

export class BotEntry extends plugin {
  constructor () {
    super({
      name: '提瓦特小助手',
      dsc: '提瓦特小助手',
      event: 'message',
      priority: 3141,
      rule: [
        {
          reg: '^#\\S+(提瓦特)?小助手\\S+$',
          fnc: 'TeyvatEnTry'
        }, {
          reg: /#更新小助手配置/,
          fnc: 'UpdataJSON'
        }
      ]
    })
  }

  async getE () {
    return this.e
  }

  async TeyvatEnTry (e) {
    if (e.is_owner) { e.reply('>>>FanSky_Qs正在施工中') }
    e.msg = e.msg.replace(/提瓦特|小助手/g, '');
    console.log('===============小助手')
    console.log(e.msg)
    let res = {};
    if (e.msg.includes('队伍伤害')) {
      e.msg = e.msg.split('队伍伤害')[1];
      res = await this.TeamDamage(e);
    }
    // let PATH = DATA_PATH.replace(/\\/g, "/");
    // let DATA_JSON = JSON.parse(fs.readFileSync(PATH));
    // console.log(DATA_JSON)
    // 错误信息
    if (res.error) {
      logger.error(res.error);
      e.reply(res.error);
      return false;
    }

    e.reply(res);
    return true
  }

  async TeamDamage (e) {
    let msg = e.msg;
    let detail = ['详情', '过程', '全图'];
    let show = false;
    _.each(detail, v => {
      if (msg.includes(v)) {
        show = true;
        msg.replace(v, '');
      }
    });
    let uid = /([0-9]{9})/g.exec(msg)[1];
    console.log('===============uid')
    console.log(uid);
    if (!uid) uid = await redis.get(`Yz:genshin:mys:qq-uid:${e.user_id}`) || false;
    if (!uid) return { error: '请先绑定uid' };
    
    let chars = msg.split(/ |,|，/g) || [];

    if (!_.isEmpty(chars)) {
      let err_chars = _.filter(chars, v => !gsCfg.getRole(v));
      if (!_.isEmpty(err_chars)) return { error: `无法识别${err_chars.join(',')}，请检查输入是否有误` };
      chars = _.map(chars, char => gsCfg.getRole(char).name);
    }
    
    return await getTeam(uid, chars, show);
  }

  async UpdataJSON (e) {
    e.reply('>>>[FanSky_Qs]正在更新提瓦特小助手JSON...')
    await this.UPJSON(e)
    return true
  }

  async UPJSON (e) {
    let PATH = DATA_PATH.replace(/\\/g, '/')
    let DATA_JSON = JSON.parse(fs.readFileSync(PATH))
    let CHAR_DATA = await getUrlJson('https://cdn.monsterx.cn/bot/gspanel/char-data.json', e)
    let HASH_TRANS = await getUrlJson('https://cdn.monsterx.cn/bot/gspanel/hash-trans.json', e)
    let CALC_RULES = await getUrlJson('https://cdn.monsterx.cn/bot/gspanel/calc-rule.json', e)
    let RELIC_APPEND = await getUrlJson('https://cdn.monsterx.cn/bot/gspanel/relic-append.json', e)
    DATA_JSON.CHAR_DATA = CHAR_DATA
    DATA_JSON.HASH_TRANS = HASH_TRANS
    DATA_JSON.CALC_RULES = CALC_RULES
    DATA_JSON.RELIC_APPEND = RELIC_APPEND
    fs.writeFileSync(PATH, JSON.stringify(DATA_JSON))
    logger.info(logger.magenta('>>>已写入CHAR_DATA配置项 '))
    logger.info(logger.magenta('>>>已写入HASH_TRANS配置项 '))
    logger.info(logger.magenta('>>>已写入CALC_RULES配置项 '))
    logger.info(logger.magenta('>>>已写入RELIC_APPEND配置项 '))
    e.reply('>>>[FanSky_Qs]提瓦特小助手JSON更新完成！')
  }
}
