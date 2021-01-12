/** 
 * 用户表，仅用于存储管理员
 */
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    username: String,
    password: String
});

module.exports = mongoose.model('tb_User', schema);