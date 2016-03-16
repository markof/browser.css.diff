function Css() {
    this.get = function(cssItem, callback) {
        $.ajax({
            url:'http://markof.cn:8800/css/',
            // url: 'http://127.0.0.1:8800/css/',
            dataType: 'json',
            data: { 'css': cssItem },
            success: function(data) {
                if (data.error === 'false') callback(null, data.data);
                else callback(new Error(data.errorcode));
            },
            error: callback(err)
        });
    }
}