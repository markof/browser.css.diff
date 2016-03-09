function App() {
    this.getLocalBrowserCssAttrs = function() {
        // 通过浏览器创建一个div对象。
        var divObj = document.createElement('div');

        // 获取浏览器支持的所有CSS属性。
        var props = [];
        for (prop in divObj.style) {
            props.push(prop);
        }
        return props;
    }

    // 从服务器获取指定的浏览器信息
    this.getBrowserCssAttrs = function(code) {
        self = this;
        // 执行report请求。
        $ && $.ajax({
            type: 'GET',
            url: 'http://markof.cn:8800/browsers/',
            dataType: 'json',
            data: { 'code': code }
        });
    }

    // 获取浏览器的相关属性，其中[appName,appVersion,platform,userAgent]是协议规定的四个接口。
    this.getLocalBrowserInfo = function() {
        // 获取浏览器的信息
        var browserInfo = {
            appName: navigator.appName,
            appVersion: navigator.appVersion,
            platform: navigator.platform,
            userAgent: navigator.userAgent,
            appCodeName: navigator.appCodeName,
            product: navigator.product,
            vendor: navigator.vendor
        };
        return browserInfo;
    }

    // 向服务器报告浏览器支持的CSS属性。
    this.reportBrowserCss = function() {
        self = this;
        // 执行report请求。
        $ && $.ajax({
            type: 'POST',
            url: 'http://markof.cn:8800/upload/',
            dataType: 'json',
            data: { browser: self.getLocalBrowserInfo(), css: self.getLocalBrowserCssAttrs() },
        });
    }
}

var app = new App();
app.reportBrowserCss();
// app.getBrowserCssAttrs();