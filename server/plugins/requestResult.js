/**
 * 请求结果
 * @param {All} msg 数据/信息
 * @param {Number} status 状态码
 */
function cc(msg, status = 1) {
    return ({
        status,
        message: msg instanceof Error ? msg.message : msg,
    });
}

module.exports = cc;