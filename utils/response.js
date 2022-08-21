
function respondMsg(res, code, msg, data) {
    res.send(JSON.stringify({
        code: code,
        msg: msg,
        data: data
    }));
}

module.exports = {
    respondMsg: respondMsg
}