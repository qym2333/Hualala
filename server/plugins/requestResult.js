/**
 * 请求结果
 * @param {All} data 数据/信息
 * @param {Number} status 状态码 0:成功/1:失败
 */
function requestResult(data, status = 1) {
    if (status == 0) {
        return {
            status,
            message: 'success',
            data: data
        }
    } else {
        return {
            status,
            message: 'error',
            data: data
        }
    }
}

module.exports = requestResult;