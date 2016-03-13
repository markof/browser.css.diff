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
browserManager.init('./browsers/map.json', function(err) {
    console.log('init browermanager');
    if (err) console.log(err);
});

// 创建express服务
const app = express();

// 配置使用的中间件
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 路由创建-上传浏览器信息
app.post('\/upload\/', function(req, res) {
    let browserinfo = req.body.browser;
    let cssinfo = req.body.css;
    browserManager.addBrowser(browserinfo, cssinfo);

    // 无论怎样都返回成功。
    res.end('{\'error\':\'false\'}');
});

// 路由创建-获取浏览器信息
app.get('\/browser\/', function(req, res) {
    // [todo]需要修改*为cssdiff.markof.cn,保证跨域cros可访问
    res.header("Access-Control-Allow-Origin", "*");
    let query = req.query;
    // 检查参数是否符合要求。
    if (req.query.hasOwnProperty('family') &&
        req.query.hasOwnProperty('platform') &&
        req.query.hasOwnProperty('version')) {
        browserManager.getBrowser(req.query.platform, req.query.family, req.query.version,function(err,data){
            if (err) res.send('{\'error\':\'true\', \'errocode\':'+ err +'}');
            else res.send(data);
        });
    }
    else {
        res.send('{\'error\':\'true\', \'errocode\':\'parameter is invalid.\'}');
    }
});

// 获取浏览器列表
app.get('\/browser\/list\/', function(req, res) {
    // [todo]需要修改*为cssdiff.markof.cn,保证跨域cros可访问
    res.header("Access-Control-Allow-Origin", "*");
    console.log('[app.get browser/list]','get request');
    res.send(JSON.stringify(browserManager.getBrowserList()));
});

// 启动端口监听
app.listen(8800, function() {
    console.log('Example app listening on port 8800!');
});