module.exports = (app, plugin, model, config) => {
    const express = require('express');
    const router = express.Router();
    const {
        Article,
        Counter
    } = model;

    const {
        getPage,
        requestResult
    } = plugin

    /** 
     * 获取文章列表
     */
    router.get('/article', async (req, res) => {
        const page = req.query.page || 1; //页码
        const size = req.query.count || 10; //每页数量

        const data = await getPage(Article, page, size);
        res.send(requestResult(data, 0))
    });

    /**  
     * 根据id获取文章
     */
    router.get('/article/:id', async (req, res) => {
        const data = await Article.find({
            id: req.params.id
        });
        res.send(requestResult(data, 0));
    });
    /**
     * 发布文章
     */
    router.post('/article', async (req, res) => {
        /**
         * 获取计数器,自增
         */
        const articleId = await Counter.findOneAndUpdate({
            name: 'articleId'
        }, {
            $inc: {
                'sequence': 1
            }
        }, {
            new: true
        });

        let result = null;
        //上传的文章信息
        const articleInfo = {
            ...req.body,
        }
        if (articleId) {
            // 自定义id
            // req.body.data.id = articleId.sequence;
            articleInfo.id = articleId.sequence;
            result = await Article.create(articleInfo)
        } else {
            /**
             * 第一次发表文章
             * 创建自增id字段
             */
            const seqData = {
                name: 'articleId',
                sequence: 10001
            }
            const seq = await Counter.create(seqData);
            articleInfo.id = seq.sequence;
            result = await Article.create(articleInfo)
        }
        res.send(requestResult(result, 0));

        // TODO：发送通知 Subscribe

    });
    /** 
     *更新文章 
     */
    router.post('/article/:id', async (req, res) => {
        // const articleInfo = {
        //     ...req.body
        // }
        // console.log(articleInfo);

        const data = await Article.findOneAndUpdate({
                id: req.params.id
            },
            req.body, (err, doc) => {
                return doc;
            });
        res.send(requestResult(data, 0));
        // res.send(req.body)
    });
    /** 
     * 删除文章
     */
    router.post('/article/del/:id', async (req, res) => {
        const data = await Article.findOneAndUpdate({
            id: req.params.id
        }, {
            deleted: true
        }, (err, doc) => {
            return doc;
        });
        res.send(requestResult(data, 0));
    });
    app.use('/admin/api', router);
}