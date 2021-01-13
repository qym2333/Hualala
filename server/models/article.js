/* 
 * 文章模块
 */
const mongoose = require('mongoose');
const moment = require('moment');

const schema = new mongoose.Schema({
    id: Number,
    title: String, // 标题
    words: Number, // 字数
    content: String, // 内容
    describe: String, // 描述
    contentHtml: String, // 内容源码
    like: { // 喜欢
        type: Number,
        default: 0
    },
    read: { // 阅读
        type: Number,
        default: 0
    },
    hide: { // 隐藏
        type: Boolean,
        default: false
    },
    deleted: {
        type: Boolean,
        default: false
    },
    music: {
        url: {
            type: String,
            default: ''
        },
        name: {
            type: String,
            default: ''
        }
    }, // 音乐
    image: {
        url: {
            type: String,
            default: ''
        },
        name: {
            type: String,
            default: ''
        }
    }, // 封面
    createTime: {
        type: Date,
        default: Date.now
    }, //创建时间
    updateTime: {
        type: Date,
        default: Date.now
    }, //更新时间
}, {
    versionKey: false,
    timestamps: {
        createdAt: 'createTime',
        updatedAt: 'updateTime'
    }
});

module.exports = mongoose.model('tb_article', schema);