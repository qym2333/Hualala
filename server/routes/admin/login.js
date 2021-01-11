module.exports = (app, plugin, model, config) => {
    const express = require('express');
    const router = express.Router();

    let {
        User
    } = model;
    let {
        requestResult
    } = plugin;

    const bcrypt = require('bcryptjs');
    const jwt = require('jsonwebtoken');

    //登录
    router.post('/login', async (req, res) => {
        const userinfo = req.body; //用户提交的账号密码
        if (!userinfo.username || !userinfo.password) {
            return res.cc('用户名或密码不能为空！');
        }
        User.find({
            username: userinfo.username
        }, (err, doc) => {
            if (doc.length != 0) {
                const cmpResult = bcrypt.compareSync(userinfo.password, doc[0].password);
                if (!cmpResult) {
                    return res.cc('密码错误！');
                }
                //获取当前登录user并去除密码内容
                const user = {
                    ...doc[0]._doc,
                    password: ''
                }
                //根据用户信息生成令牌
                const token = jwt.sign(user, config.secretKey, {
                    expiresIn: config.expiresIn
                });
                res.json({
                    status: 0,
                    message: '登录成功！',
                    token: token
                });
            } else {
                res.cc('用户不存在！');
            }
        });
    });
    //注册
    router.post('/register', async (req, res) => {
        const userinfo = req.body;
        if (!userinfo.username || !userinfo.password) {
            return res.cc('用户名或密码不能为空！');
        }
        const len = await User.find().countDocuments(); //user表中是否存在数据，len=1
        //加密用户密码，bcrypt.hashSync('明文'，随机盐长度)
        userinfo.password = bcrypt.hashSync(userinfo.password, 10);
        if (len) {
            res.cc('只允许存在一个管理员！');
        } else {
            // 创建账号
            await User.create(userinfo, (err, doc) => {
                if (doc.length != 0) {
                    res.cc('注册成功！', 0);
                } else {
                    res.cc('创建失败,请检查数据库或服务器是否正常！')
                }
            });
        }
    });
    //修改密码
    router.post('/password', (req, res) => {
        const _id = req.user._id; //获取token中的用户id
        const info = req.body;
        User.find({
            _id
        }, (err, doc) => {
            if (err) return res.cc('查询出错');
            if (doc.length != 0) {
                const cmpResult = bcrypt.compareSync(info.password, doc[0].password);
                if (!cmpResult) {
                    return res.cc('原密码错误！');
                }
                //加密新密码
                info.newpassword = bcrypt.hashSync(info.newpassword, 10);
                //根据id修改password
                User.findByIdAndUpdate(_id, {
                    password: info.newpassword
                }, (err, doc) => {
                    if (err) return res.cc('修改失败！');
                    res.cc('修改成功！', 0);
                })
            } else {
                res.cc('用户不存在！');
            }
        });
    });
    app.use('/admin/api', router);
}