function Browser() {
    this.browserList = null;
    
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
        var self = this;
        // 执行report请求。
        $ && $.ajax({
            type: 'POST',
            url: 'http://192.168.31.191:8800/upload/',
            dataType: 'jsonp',
            data: { browser: self.getLocalBrowserInfo(), css: self.getLocalBrowserCssAttrs() },
        });
    }
    
    // 获取所有的浏览器list信息
    this.initBrowserList = function(){
        var self = this;
        $ && $.ajax({
            type: 'GET',
            url : 'http://192.168.31.191:8800/browser/list',
            dataType : 'json',
            success:function(data){
                console.log(data);
                self.browserList = data;
            },
            error:function(err){
                console.log(err);
            }
        });
    }
}