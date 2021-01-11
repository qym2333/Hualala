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
                    ...doc[0],
                    password: '',
                }
                console.log("🚀 ~ file: login.js ~ line 31 ~ router.post ~ user", user)
                //根据用户信息生成令牌
                const token = jwt.sign(user, config.secretKey, {
                    expiresIn: config.expiresIn
                });
                res.json({
                    status: 0,
                    message: '登录成功！',
                    token: 'Bearer ' + token
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
        const len = await User.find().countDocuments();
        console.log(len);
        //加密用户密码，bcrypt.hashSync('明文'，随机盐长度)
        userinfo.password = bcrypt.hashSync(userinfo.password, 10);

        if (len) {
            res.cc('该用户已存在！');
        } else {
            // 创建账号
            await User.create(userinfo, (err, doc) => {
                if (doc.length != 0) {
                    res.cc('注册成功！', 0);
                } else {
                    res.cc('创建失败,请检查数据库或服务器是否正常！')
                }
            })
        }
    });

    app.use('/admin/api', router);
}