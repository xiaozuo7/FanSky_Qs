import plugin from '../../../lib/plugins/plugin.js'
import { segment } from 'oicq'
import common from '../../../lib/common/common.js'
import fetch from 'node-fetch'

export class CatsEyeBoxOffice extends plugin {
  constructor () {
    super({
      name: '猫眼票房',
      dsc: '猫眼票房',
      event: 'message',
      priority: 7,
      rule: [
        {
          reg: /^#?(电影|猫眼|实时)?票房$/,
          fnc: 'CatEyeBoxOffice'
        }
      ]
    })
  }

  async CatEyeBoxOffice (e) {
    // 获取当前时间戳
    let nowTime = new Date().getTime()
    let random32 = await this.getId32()
    let url = `http://pf.fe.st.maoyan.com/dashboard-ajax?orderType=0&uuid=57b6168c-1503-4e64-b1bb-f1f2da22316d&timeStamp=${nowTime}&User-Agent=TW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEwOS4wLjAuMCBTYWZhcmkvNTM3LjM2IEVkZy8xMDkuMC4xNTE4Ljcw&index=49&channelId=40009&sVersion=2&signKey=${random32}`
    let res = await fetch(url).catch((err) => logger.error(err))
    if (!res) {
      logger.error(`${url}请求失败...`)
      return await e.reply(`${url}\n请求失败~~`)
    }
    let Json = await res.json()
    console.log(Json)
    // let Json=await getUrlJson(url, e)
    let UpdateTime = new Date(Json.movieList.data.updateInfo.updateTimestamp).toLocaleString()
    let MsgList = []
    MsgList.push(`实时大盘：${Json.movieList.data.nationBoxInfo.nationBoxSplitUnit.num} ${Json.movieList.data.nationBoxInfo.nationBoxSplitUnit.unit}\n总出票为：${Json.movieList.data.nationBoxInfo.viewCountDesc}张\n总场次为：${Json.movieList.data.nationBoxInfo.showCountDesc}场\n更新时间：${UpdateTime}\n数据来源：猫眼电影\n当前在榜：${Json.movieList.data.list.length}部\n当前最大仅显示前15部喵~\n`)
    const totalBoxOffice = Json.movieList.data.nationBoxInfo.nationBoxSplitUnit.num * ({
      万: 10000,
      亿: 100000000
    }[Json.movieList.data.nationBoxInfo.nationBoxSplitUnit.unit] || 1)
    let LoadNum
    if (Json.movieList.data.list.length > 15) {
      LoadNum = 15
    } else {
      LoadNum = Json.movieList.data.list.length
    }
    for (let i = 0; i < LoadNum; i++) {
      let ImgUrl = await this.getMoviImg(Json.movieList.data.list[i].movieInfo.movieId, e)
      // 如果ImgUrl
      if (!ImgUrl || ImgUrl.length < 10) {
        ImgUrl = 'https://th.bing.com/th/id/R.6cc3c8870914ee76b8cf1c7f9d4b9970?rik=svdPITKpVuLUQQ&riu=http%3a%2f%2fpic.2265.com%2fupload%2f2017-2%2f20172281342598429.png&ehk=vM0xLEANoMbzxZIyzq0d01jiA4voira1iUnjadRj3Wg%3d&risl=&pid=ImgRaw&r=0'
      }
      let NuwBoxOffice = await this.ConvertNum((parseFloat(Json.movieList.data.list[i].boxRate) / 100) * totalBoxOffice)
      MsgList.push(`   《${Json.movieList.data.list[i].movieInfo.movieName}》\n排名：${i + 1}  |  ${Json.movieList.data.list[i].movieInfo.releaseInfo}\n综合票房：${NuwBoxOffice}  |  ${Json.movieList.data.list[i].boxRate}\n今日均场：${Json.movieList.data.list[i].avgShowView}人  |  ${Json.movieList.data.list[i].avgSeatView} \n今日排片：${Json.movieList.data.list[i].showCount}  |  ${Json.movieList.data.list[i].splitBoxRate}`, segment.image(ImgUrl))
      // \n${segment.image(await this.getMoviImg(Json.movieList.data.list[i].movieInfo.movieId, e))}
    }
    await this.SendMsg(e, MsgList)
    return true
  }

  async ConvertNum (movieBoxOffice) {
    let unit = ''
    let num = movieBoxOffice
    if (movieBoxOffice >= 100000000) {
      unit = '亿'
      num = movieBoxOffice / 100000000
    } else if (movieBoxOffice >= 10000) {
      unit = '万'
      num = movieBoxOffice / 10000
    }
    return unit ? `${num.toFixed(2)}${unit}` : `${movieBoxOffice}`
  }

  async SendMsg (e, MsgList) {
    let Msg = await common.makeForwardMsg(e, MsgList, '猫眼票房 | FanSky_Qs~')
    try {
      // let send=e.reply(res_one,false, { at: false, recallMsg: 30 })
      let SendStatus = await e.reply(Msg)
      if (!SendStatus) {
        await e.reply('哎呀，发送失败了...', true)
        return true
      }
    } catch (err) {
      console.log(err)
      await e.reply('哎呀，发送失败了...', true)
    }
    return true
  }

  async getId32 () {
    const list = []
    const range = '0123456789abcdefghijklmnopqrstuvwxyz'
    for (let i = 0; i < 32; i++) {
      list[i] = range.substr(Math.floor(Math.random() * 0x10), 1)
    }
    list[19] = '4'
    return list.join('')
  }

  async getId2_3 () {
    return Math.floor(Math.random() * (999 - 100 + 1) + 100)
  }

  async getMoviImg (ID, e) {
    let Nowtime = new Date().getTime()
    let random32 = await this.getId32()
    let randomNum = await this.getId2_3()
    let url = `http://pf.fe.st.maoyan.com/dashboard-ajax/movie?movieId=${ID}&orderType=0&uuid=186027caaacc8-0ab79fdfce64b4-7d5d5474-144000-186027caaac4d&timeStamp=${Nowtime}&User-Agent=TW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEwOS4wLjAuMCBTYWZhcmkvNTM3LjM2IEVkZy8xMDkuMC4xNTE4Ljcw&index=${randomNum}&channelId=40009&sVersion=2&signKey=${random32}`
    let res = await fetch(url).catch((err) => logger.error(err))
    if (!res) {
      logger.error(`${url}请求失败...`)
      return await e.reply(`${url}\n请求失败~~`)
    }
    let Json = await res.json()
    // 如果Json为空
    if (!Json || Json.length === 0) {
      return 'https://th.bing.com/th/id/R.6cc3c8870914ee76b8cf1c7f9d4b9970?rik=svdPITKpVuLUQQ&riu=http%3a%2f%2fpic.2265.com%2fupload%2f2017-2%2f20172281342598429.png&ehk=vM0xLEANoMbzxZIyzq0d01jiA4voira1iUnjadRj3Wg%3d&risl=&pid=ImgRaw&r=0'
    }
    // let Json=await getUrlJson(url,e)
    return Json.movieInfo.movieInfo.imgUrl
  }
}
