const express = require('express');
const app = express();
const port = 3000;
const expressJwt = require("express-jwt");
const fs = require('fs');
const config = require('./configs/config');

app.use(require('cors')()); //跨域
app.use(express.urlencoded({
    extended: false
})); //解析表单post请求数据

/**
 *  静态数据
 */
app.use('/uploads', express.static(__dirname + '/uploads'));

/**
 * 验证token
 * 跳过用户接口
 */
app.use(expressJwt({
    secret: config.secretKey,
    algorithms: ['HS256'],
}).unless({
    path: ["/admin/api/login", "/admin/api/register"]
    // path: [/^\/api\//]
}));

/**
 *  全局方法
 * 接口模块
 */
const fileName = ['plugins', 'models'];
const global = fs.readdirSync(__dirname).filter(i => fileName.includes(i)).reduce((total, item) => {
    const files = fs.readdirSync(__dirname + '/' + item)
    files.map(i => {
        let name = i.replace('.js', '');
        let nameKey = i.replace('.js', '');
        if (item == 'models') {
            nameKey = name.replace(/^\S/, s => s.toUpperCase());
        }
        total[item][nameKey] = require(__dirname + '/' + item + '/' + name);
    })
    return total
}, {
    'plugins': {},
    'models': {}
});

// 加载所有路由
const dirname = __dirname + '/routes'
fs.readdirSync(dirname).forEach((i) => {
    const file = dirname + '/' + i;
    if (fs.statSync(file).isDirectory()) {
        fs.readdirSync(file).forEach(item => {
            const name = item.replace('.js', '');
            require(file + '/' + name)(app, global['plugins'], global['models'], config);
        });
    }
});

// 全局错误中间件
app.use((err, req, res, next) => {
    //Token过期
    if (err.name === 'UnauthorizedError') {
        res.status(err.status || 401);
        res.send({
            message: 'token过期，请重新登录！',
            code: 401,
            time: err.inner.expiredAt
        });
        return;
    }
    res.send(err.message);
});

require('./plugins/db')(app);

app.listen(port, () => console.log(`Example app listening on http://127.0.0.1:${port}!`));