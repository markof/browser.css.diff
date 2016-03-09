/**
 * 
 * 
 * 
 */
'use strict'

// 创建express对象
const express = require('express');
const bodyParser = require('body-parser');
const browserManager = require('./browsermanager.js');

// 初始化
browserManager.init('./browsers/map.json',function(err){
    if (err) console.log(err);
});

// 创建express服务
const app = express();

// 配置使用的中间件
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 路由创建-上传浏览器信息
app.post('\/upload\/', function (req, res) {
    let browserinfo = req.body.browser;
    let cssinfo = req.body.css;
    browserManager.addBrowser(browserinfo,cssinfo);
});

// 路由创建-获取浏览器信息
app.get('\/browsers\/', function (req, res) {
    let query = req.query;
});

// 启动端口监听
app.listen(8800, function () {
    console.log('Example app listening on port 8800!');
    console.log(process.cwd());
});