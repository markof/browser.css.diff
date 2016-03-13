(function($){
    $.fn.tap = function(cb){
        var callback = typeof(cb) =='function' ? cb : null;
        var self = this;
        
        // 用于标识当前是否再按下200ms内。
        var tapTag = false;
        
        // 绑定touchstart事件，并启动定时器，如果超过200ms就标识该事件失效。
        $(self).on('touchstart',function(e){
            e.preventDefault();
            tapTag = true;
            setTimeout(function() {
                tapTag = false;
            }, 200);
        });
        
        // 
        $(self).on('touchend',function(e){
            if (tapTag){
                e.preventDefault();
                e.stopPropagation();
                cb.apply(e.target);
            }
        });
    }
})(jQuery);