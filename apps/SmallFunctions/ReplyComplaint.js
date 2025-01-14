import {getComplaint} from '../../models/getString.js'
import common from '../../../../lib/common/common.js'

export async function Complaint(e) {
    if ((e.atBot || e.atme) && !e.msg) {
        await ReplyComplaint(e)
    } else if (e.msg === '#发病' || e.msg === '#发电' || e.msg === '#发癫' || e.msg === '#发疯') {
        await ReplyComplaint(e)
    } else {
        return false
    }
}

async function ReplyComplaint(e) {
    let Name = e.sender.nickname || e.sender.card
    let Complaint = await getComplaint()
    let Reply = Complaint.replace(/{target_name}/g, Name)
    if (Reply.length > 80) {
        let MsgList = [`${Reply}`]
        let SendResult = await common.makeForwardMsg(e, MsgList, `${Name},嘿嘿嘿,我的${Name}(流口水)~`)
        await e.reply(SendResult)
    } else {
        await e.reply(Reply, false, {recallMsg: 30})
    }
    return true
}
