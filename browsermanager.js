/**
 * 
 * 
 * 
 */

'use strict'

// 导入必要的模块
// fs模块用于读写文件
const fs = require('fs');

// useragent模块用于解析useragent字符串
const useragent = require('useragent');

/**模块内的全局对象, 用于保存浏览器信息和文件的对应关系
 * {'platformA':{
 *      browserA: {
 *          version1 : filePath,
 *          version2 : filePath,
 *      },
 *      browserB: {
 *          version1 : filePath,
 *          version2 : filePath,
 *      }
 * }}
 */
let map = {
    browsers: {},
    path: '',

    // 用于保存map数据到文件中
    save: function() {
        
        // [debug用]
        console.log('[map.save]this:', this.browsers);
        
        let fd = fs.openSync(this.path, 'w');
        fs.writeFile(this.path, JSON.stringify(this.browsers), 'utf8', function(err) {
            fs.close(fd);
        });
    },

    // 在map节点中增加一个浏览器的信息
    add: function(family, platform, version, filePath) {
        // 用于逐层在map中检查该对象是否存在，如果不存在则建立该对象。
        if (!this.browsers[platform]) {
            this.browsers[platform] = {};
            this.browsers[platform][family] = {};
            this.browsers[platform][family][version] = filePath;
        }
        else if (!this.browsers[platform][family]) {
            this.browsers[platform][family] = {};
            this.browsers[platform][family][version] = filePath;
        }
        else if (!this.browsers[platform][family][version]) {
            this.browsers[platform][family][version] = filePath;
        }
        else {
            // 存在重复。
        }
    }
};

// 模块初始化
// mapPath是map文件的地址。
// cb是回调函数。
exports.init = function(mapPath, cb) {
    // [todo]promise改造
    fs.exists(mapPath, (exists) => {
        fs.readFile(mapPath, (err, data) => {
            // [todo]json转换的错误处理
            map.browsers = JSON.parse(data);
            map.path = mapPath;
            // 调用回调函数
            cb(err);
        });
    });
};

// 通过获取浏览器的信息来解析
// browserInfo是包含协议规定的四个navigator属性的Json对象
// cssInfo是包含所有支持的style属性的数组
exports.addBrowser = function(browserInfo, cssInfo) {
    // 检查输入的对象中是否包含如下属性。
    // navigator.appName
    // navigator.appVersion
    // navigator.platform
    // navigator.userAgent
    // 检查cssInfo是否是数组
    if (browserInfo.hasOwnProperty('appName')
        && browserInfo.hasOwnProperty('appVersion')
        && browserInfo.hasOwnProperty('platform')
        && browserInfo.hasOwnProperty('userAgent')
        && Array.isArray(cssInfo)) {
        saveBrowser(browserInfo, cssInfo);
    }
    // [debug用]
    // else {
    //     console.log('[browser]浏览器信息不符合标准，浏览器信息：', browserInfo);
    // }
}

// 保存浏览器对象
// browserInfo是包含协议规定的四个navigator属性的Json对象
// cssInfo是包含所有支持的style属性的数组
function saveBrowser(browserInfo, cssInfo) {
    // 解析userAgent
    let userAgent = useragent.parse(browserInfo.userAgent);

    // userAgent伪造检查
    if (!validateBrowserInfo(browserInfo)) {
        // userAgent存在伪造
        return false;
    }

    // 如果在map中找不到该浏览器的指定平台下的版本，则说明该浏览器不存在。
    let browserVersion = userAgent.major + '.' + userAgent.minor + '.' + userAgent.patch;
    // 检查map对象中是否存在该浏览器信息
    if (map.browsers[browserInfo.platform]
        && map.browsers[browserInfo.platform][userAgent.family]
        && map.browsers[browserInfo.platform][userAgent.family][browserVersion]) {
        //已经存在
    }
    // 如果不存在则进行文件创建。
    else {
        // 定义文件目录层级
        let browserFolder = './browsers';
        let browerPlatformFolder = browserFolder + '/' + browserInfo.platform;
        let browerFamilyFolder = browerPlatformFolder + '/' + userAgent.family

        // 判断文件夹是否存在，如果不存在就建立该文件夹
        // [todo]需要修改默认的权限。
        checkFolderExist(browserFolder, browerPlatformFolder, browerFamilyFolder, function(err) {
            if (err) {
                console.log('以外错误，可能是缺少权限，具体错误信息：', err);
                return false;
            }
            // 默认保存为json文件。
            let browserFileName = browerFamilyFolder + '/' + browserVersion + '.json';
            let browserFileData = { 'browserInfo': browserInfo, 'cssInfo': cssInfo };
            saveBrowserFile(browserFileName, JSON.stringify(browserFileData), function(err) {
                if (err) {
                    console.log(err);
                    return false;
                }
                // 文件创建成功后，在map对象中创建该map对象
                map.add(userAgent.family, browserInfo.platform, browserVersion, browserFileName);
                map.save();
            });
        });//end of checkFolderExist
    }
}

// 递归方式，进行folder的检查，退出条件是没有参数传递。
function checkFolderExist() {
    // 获取aguments中的第一个，进行检查
    // 检查结束后，获取aguments剩下的参数，然后继续检查，直到只有一个argument
    // 如果出现错误，就打印错误。
    let callee = this;

    // 把参数转换为数组
    let args = Array.prototype.slice.call(arguments);

    // 获取最后一个参数，这里规定最后一个参数为回调函数
    let lastArg = args[args.length - 1];

    // 判断cb是否是一个回调函数
    let cb = typeof (lastArg) == 'function' ? lastArg : null;

    // 这里回调是必须要的参数。
    if (args.length != 1) {
        let folder = args.shift();
        fs.exists(folder, (exists) => {
            if (!exists) {
                fs.mkdir(folder, (err) => {
                    if (err) cb && cb(err);
                    checkFolderExist.apply(callee, args);
                });
            }
            else {
                checkFolderExist.apply(callee, args);
            }
        });
    }
    else {
        // [debug用]
        // console.log('[checkFolderExist]检查完毕');
        cb && cb(null);
    }
}

// 保存浏览器的相关数据
function saveBrowserFile(fileName, data, cb) {
    // [debug用]
    // console.log('[saveBrowserFile]filename:', fileName);

    let fd = fs.openSync(fileName, 'w');
    fs.writeFile(fileName, data, 'utf8', function(err) {
        fs.close(fd);
        cb(err);
    });
}

// 检测userAgent是否是伪造的，虽然能过滤一些，但不能保证全部。
// browserInfo是包含协议规定的四个navigator属性的Json对象
function validateBrowserInfo(browserInfo) {
    let userAgent = useragent.parse(browserInfo.userAgent);

    // 规则1：如果浏览器的userAgent表示是一个移动浏览器，但平台又是桌面平台，则说明是伪造的。
    if (/Mobile/.test(userAgent.family)) {
        // [debug用]
        // console.log('[validateBrowserInfo]', userAgent);
        if (browserInfo.platform == 'Win32' || browserInfo.platform == 'MacIntel') {
            return false;
        }
        else {
            return true;
        }
    }
    else {
        return true;
    }
}

