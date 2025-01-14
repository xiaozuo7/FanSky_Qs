import fs from "fs";
import {getHelpBg} from "../../models/getTuImg.js";

let cwd = process.cwd().replace(/\\/g, '/')

export async function screenData(e) {
    // let BgImgPath=`${cwd}/plugins/FanSky_Qs/resources/help/img/bg`
    let NameList=['艾尔海森','八重神子','迪希雅','甘雨','柯莱','可莉','流浪者','纳西妲','妮露','赛诺','提纳里','夜兰']
    let Package = `${cwd}/plugins/FanSky_Qs/package.json`
    let YunzaiPath = `${cwd}/package.json`
    let Version = JSON.parse(fs.readFileSync(Package));
    let Yunzai = JSON.parse(fs.readFileSync(YunzaiPath));
    let Data = (await helpData()).helpData
    let headImg = (NameList[Math.floor(Math.random() * NameList.length)])
    // let RandomBgImg
    // fs.readdir(BgImgPath, (err, files) => {if (err) throw err;RandomBgImg = files[Math.floor(Math.random() * files.length)];console.log("随机名字："+RandomBgImg); });
    let AcgPath=await getHelpBg()
    return {
        acgBg: AcgPath,
        YunzaiName: Yunzai.name,
        YunzaiVersion: Yunzai.version,
        helpData: Data,
        version: `${Version.version}`,
        saveId: e.user_id,
        cwd: cwd,
        tplFile: `${cwd}/plugins/FanSky_Qs/resources/help/help.html`,
        /** 绝对路径 */
        pluResPath: `${cwd}/plugins//FanSky_Qs/resources/help/`,
        headStyle: `<style> .head_box { background: url(${cwd}/plugins/FanSky_Qs/resources/help/img/titleImg/${headImg}.png) #fbe1c0; background-position-x: 42px; background-repeat: no-repeat; background-size: auto 101%; }</style>`
    }
}

export async function helpData() {
    return {
        helpData: [
            {
                "group": "原神排行榜[数据来源：非小酋]",
                "list": [
                    {
                        "icon": "team",
                        "title": "#成就排行",
                        "desc": "官 & B服成就排行"
                    }, {
                        "icon": "问号",
                        "title": "#宝箱排行",
                        "desc": "官 & B服宝箱排行"
                    }
                ]
            },
            {
                "group": "【打卡-魔晶系统】[正在开发小游戏]",
                "list": [
                    {
                        "icon": "sign",
                        "title": "打卡、冒泡",
                        "desc": "记录你的每一天信息"
                    }, {
                        "icon": "role",
                        "title": "首次打卡时间",
                        "desc": "你的首次打卡时间"
                    }
                ]
            },
            {
                "group": "单功能菜单",
                "list": [
                    {
                        "icon": "丁真",
                        "title": "一眼丁真",
                        "desc": "各种丁真表情包"
                    },
                    {
                        "icon": "猫眼票房",
                        "title": "电影票房",
                        "desc": "猫眼实时电影票房"
                    },
                    {
                        "icon": "点赞",
                        "title": "点赞",
                        "desc": "发送卡片并点赞(需要加机器人好友)"
                    },
                    {
                        "icon": "发病",
                        "title": "发病",
                        "desc": "或艾特机器人不加任何消息 | 对你发病"
                    },
                ]
            },
            {
                "group": "OpenAI功能：艾特机器人即可开始聊天",
                "list": [
                    {
                        "icon": "OpenAI",
                        "title": "模型列表",
                        "desc": "查看当前已有模型列表"
                    },
                    {
                        "icon": "OpenAI",
                        "title": "#重置对话",
                        "desc": "重新开始你的记忆"
                    }, {
                        "icon": "OpenAI",
                        "title": "设置模型人设xxx",
                        "desc": "将OpenAI模型人设设置为xxx(每个人独立的)"
                    },
                ]
            }, {
                "group": "主人命令",
                "list": [
                    {
                        "icon": "OpenAI",
                        "title": "#设置模型key sk-xxxxxx",
                        "desc": "设置OpenAI的key"
                    },
                    {
                        "icon": "OpenAI",
                        "title": "设置OpenAI开启",
                        "desc": "OpenAI总开关[开启、关闭]"
                    }, {
                        "icon": "OpenAI",
                        "title": "#清空全部",
                        "desc": "清除所有人的对话记录"
                    }, {
                        "icon": "OpenAI",
                        "title": "设置模型人设xxx",
                        "desc": "设置OpenAI的全局人设[xxx]"
                    }, {
                        "icon": "OpenAI",
                        "title": "拉黑模型使用[QQ]",
                        "desc": "拉黑某人使用，如：拉黑模型使用3141865879"
                    }, {
                        "icon": "OpenAI",
                        "title": "更换语言模型1",
                        "desc": "更换OpenAI的语言模型[1、2]"
                    }, {
                        "icon": "OpenAI",
                        "title": "设置模型打卡开启",
                        "desc": "OpenAI的使用绑定魔晶[开启、关闭]"
                    }, {
                        "icon": "sign",
                        "title": "打卡总计",
                        "desc": "统计今日已经打卡和系统总打卡用户"
                    },{
                        "icon": "点赞",
                        "title": "#开启fan点赞",
                        "desc": "设置点赞功能开启"
                    },
                ]
            },
        ]
    }
}