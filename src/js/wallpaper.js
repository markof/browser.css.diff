function wallpaper() {
    this.randomWallpaper = null;
    this.wallpaperList = null;

    // 得到随机一张wallpaper
    this.getRandomWallpaper = function(cb) {
        // 检查cb是否是回调函数。这里约定回调函数的第一个参数总是Error对象。
        var callback = (typeof (cb) == 'function') ? cb : null;
        getWallpaper('random', function(err, data) {
            if (err) callback && callback(err, data);
            else {
                this.randomWallpaper = data;
                callback && callback(null, data);
            }
        });
    }

    // 得到默认的最新20张wallpaper
    this.getWallpaperList = function(cb) {
        var callback = (typeof (cb) == 'function') ? cb : null;
        getWallpaper('list', function(err, data) {
            if (err) callback && callback(null, data);
            else {
                this.wallpaperList = data;
                callback && callback(null, data);
            }
        });
    }

    // 公共函数，获取wallpaper
    function getWallpaper(type, cb) {
        var url = null;
        switch (type) {
            case 'random': url = 'https://api.desktoppr.co/1/wallpapers/random'; break;
            case 'list': url = 'https://api.desktoppr.co/1/wallpapers'; break;
            default: break;
        }

        $.ajax({
            url: url,
            dataType: 'jsonp',
            type: 'GET',
            success: function(data) { cb && cb(null, data); },
            error: function() { cb && cb(new Error('can not get wallpaper')); }
        });
    }
}

