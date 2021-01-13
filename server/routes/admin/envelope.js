module.exports = (app, plugin, model, config) => {
    const express = require('express');
    const router = express.Router();
    const moment = require('moment');

    const {
        Envelope
    } = model;
    const {
        dateFormat
    } = plugin;

    /** 
     * 获取信列表
     */
    router.get('/envelope', async (req, res) => {
        //获取前100封信
        const data = await Envelope.find({}).sort({
            time: -1
        }).limit(100);
        //格式化数据中的时间
        data.forEach(item => item._doc['time'] = dateFormat(item.time));
        res.send(data);
    });

    /** 
     * 写一封信
     */
    router.post('/envelope', async (req, res) => {
        const data = await Envelope.create(req.body);
        res.send(data);
    });

    /** 
     * 根据id编辑
     */
    router.post('/envelope/:id', async (req, res) => {
        //查找并更新数据
        const data = await Envelope.findByIdAndUpdate(req.params.id, req.body, {}, (err, doc) => {
            if (err) return res.cc('修改失败！');
        });
        res.send({
            status: 0,
            message: '修改成功！',
            data: data
        });
    });
    /** 
     * 根据id获得指定信
     */
    router.get('/envelope/:id', async (req, res) => {
        const data = await Envelope.findById(req.params.id, req.body);
        // data._doc['time'] = dateFormat(data.time);
        res.send(data);
    });
    /** 
     * 删除
     */
    router.delete('/envelope/:id', async (req, res) => {
        await Envelope.findByIdAndDelete(req.params.id, req.body)
        res.send({
            status: 0,
            message: '删除成功！'
        });
    });
    app.use('/admin/api', router);
}