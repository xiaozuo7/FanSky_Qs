import fs from 'fs'
import getCfg from '../../models/getCfg.js'

let yunPath = process.cwd()

export async function OnOFF(e) {
    if (!e.isMaster) {
        e.reply("你不能关闭我喵~")
        return true
    }
    let path = `${process.cwd()}/plugins/FanSky_Qs/config/OpenAI.json`
    path = path.replace(/\\/g, '/')
    let OpenAIJson = JSON.parse(fs.readFileSync(path))
    if (!OpenAIJson.OnOff) {
        OpenAIJson.OnOff = "开启"
        await fs.writeFileSync(path, JSON.stringify(OpenAIJson))
    }
    if (e.msg.includes("打开") || e.msg.includes("开启") || e.msg.includes("启用")) {
        OpenAIJson.OnOff = "开启"
        await fs.writeFileSync(path, JSON.stringify(OpenAIJson))
    } else {
        OpenAIJson.OnOff = "关闭"
        await fs.writeFileSync(path, JSON.stringify(OpenAIJson))
    }
    e.reply(`OpenAI设置成功：${OpenAIJson.OnOff}`)
    return true
}

export async function SetOpenAIKey(e) {
    if (!e.isMaster) {
        e.reply('打咩，只有主人能够设置Key~')
        return true
    }
    if (e.isGroup) {
        e.reply('主人，这种事情我们私聊好不好qwq~')
        return true
    }
    let Key = e.msg.match(/#(设置|更改|修改|添加|更换)(OpenAI|模型|语言模型|OpenAI模型)key(.*)/)[3]
    if (!Key || Key.length < 10) {
        e.reply('你的Key好像不太对喵~\n大概格式：sk-xxxxxxxxxxx....\n获取：OpenAI官网')
        return true
    }
    let path = `${process.cwd()}/plugins/FanSky_Qs/config/OpenAI.json`
    path = path.replace(/\\/g, '/')
    let OpenAIJson = JSON.parse(fs.readFileSync(path))
    OpenAIJson.OpenAI_Key = Key
    await fs.writeFileSync(path, JSON.stringify(OpenAIJson))
    e.reply(`Key设置成功~\nOpenAI_Key:${Key} \n触发方式：艾特或回复机器人说话即可`)
    return true
}

export async function ChangeAISignMode(e) {
    if (!e.isMaster) {
        e.reply('打咩，你还不可以控制这个噢(Ｔ▽Ｔ)~')
        return true
    }
    let path = `${process.cwd()}/plugins/FanSky_Qs/config/OpenAI.json`
    path = path.replace(/\\/g, '/')
    let OpenAIJson = JSON.parse(fs.readFileSync(path))
    let SignMode = e.msg.match(/#?(设置|更改|修改)模型打卡(开启|打开|启用|关闭|不启用)/)[2]
    // 读取SignMode，如为开启、打开、启用，则为true，否则为false
    let ModeSta = !!(SignMode === '开启' || SignMode === '打开' || SignMode === '启用')
    if (ModeSta) {
        OpenAIJson.SignMode = '开启'
        await fs.writeFileSync(path, JSON.stringify(OpenAIJson))
        e.reply('艾特对话 绑定打卡系统开启')
    } else {
        OpenAIJson.SignMode = '关闭'
        await fs.writeFileSync(path, JSON.stringify(OpenAIJson))
        e.reply('艾特对话 绑定打卡系统关闭')
    }
    return true
}

export async function ChangeAIModelMode(e) {
    if (!e.isMaster) {
        e.reply('打咩，你还不可以控制这个噢(Ｔ▽Ｔ)~')
        return true
    }
    let path = `${process.cwd()}/plugins/FanSky_Qs/config/OpenAI.json`
    path = path.replace(/\\/g, '/')
    let msg = e.msg
    let ModelMode = Number(msg.match(/\d+/)[0])
    let OpenAIJson = JSON.parse(fs.readFileSync(path))
    if (ModelMode === 1) {
        OpenAIJson.ModelMode = ModelMode
        await fs.writeFileSync(path, JSON.stringify(OpenAIJson))
        e.reply(`您选择了模式${ModelMode}:\n1:每轮重置,不记忆对话`)
    } else if (ModelMode === 2) {
        OpenAIJson.ModelMode = ModelMode
        await fs.writeFileSync(path, JSON.stringify(OpenAIJson))
        e.reply(`您选择了模式${ModelMode}：\n每轮不重置,记忆对话`)
    } else {
        e.reply(`您选择了模式${ModelMode},暂时仅支持1和2两种模式~\n1:每轮重置\n2:每轮不重置,记忆对话\n当前模型模式：${OpenAIJson.ModelMode}}`)
    }
    return true
}

export async function addBlackList(e) {
    if (!e.isMaster) {
        e.reply('打咩，你在赣神魔！∑(ΦдΦlll~')
        return true
    }
    let path = `${process.cwd()}/plugins/FanSky_Qs/config/OpenAI.json`
    path = path.replace(/\\/g, '/')
    let msg = e.msg
    let QQ = Number(msg.match(/\d+/)[0])
    let OpenAIJson = JSON.parse(fs.readFileSync(path))
    if (OpenAIJson.BlackList.indexOf(QQ) === -1) {
        OpenAIJson.BlackList.push(QQ)
        await fs.writeFileSync(path, JSON.stringify(OpenAIJson))
        e.reply(`已将${QQ}加入黑名单`)
    } else {
        e.reply(`${QQ}已经在黑名单中了`)
    }
    return true
}

export async function SetPersona(e) {
    let Persona = e.msg.match(/#?(设置|更改|修改)模型人设(.*)/)[2]
    if (Persona.length <= 6) {
        e.reply('好短，我不同意这个设定，再想一个更好的嘛！(∩ﾟдﾟ)')
        return true
    }
    if (e.isMaster) {
        let path = `${process.cwd()}/plugins/FanSky_Qs/config/OpenAI.json`
        path = path.replace(/\\/g, '/')
        let OpenAIJson = JSON.parse(fs.readFileSync(path))
        OpenAIJson.Persona = Persona
        await fs.writeFileSync(path, JSON.stringify(OpenAIJson))
        e.reply(`已将全局模型人设更改为（当别人没有设置人设将使用全局人设）：\n${Persona}`)
        return true
    } else {
        let singleModelFolder = `${process.cwd()}/resources/FanSky`
        let singleModel = `${process.cwd()}/resources/FanSky/singleModel.json`
        if (!fs.existsSync(singleModelFolder)) {
            fs.mkdirSync(singleModelFolder);
            console.log('>>>已创建FanSky文件夹')
        }
        if (!fs.existsSync(singleModel)) {
            fs.writeFileSync(singleModel, '{}');
            console.log('>>>已创建singleModel.json文件')
        }
        let singleModelConfig = JSON.parse(fs.readFileSync(singleModel))
        singleModelConfig[e.user_id] = Persona
        fs.writeFileSync(singleModel, JSON.stringify(singleModelConfig));
        e.reply(`已将您的模型人设设置为：\n${Persona}`)
        // e.reply('不行哇，你不能这么做！〣 ( ºΔº ) 〣')
        return true
    }
}

export async function ChangeAIModel(e) {
    if (!e.isMaster) {
        e.reply('打咩，你还不可以控制这个噢(Ｔ▽Ｔ)~')
        return true
    }
    let path = `${process.cwd()}/plugins/FanSky_Qs/config/OpenAI.json`
    path = path.replace(/\\/g, '/')
    let msg = e.msg
    let model = Number(msg.match(/\d+/)[0])
    if (model === 1 || model === 2) {
        let OpenAIJson = JSON.parse(fs.readFileSync(path))
        OpenAIJson.Model = model
        await fs.writeFileSync(path, JSON.stringify(OpenAIJson))
        let Model_list = (await getCfg(yunPath, 'OpenAI')).Model_list
        e.reply(`已切换为${model}号模型: ${Model_list[model - 1]}`)
    } else {
        e.reply(`您选择了${model}号模型,暂时仅支持1号和2号模型~`)
    }
    return true
}

