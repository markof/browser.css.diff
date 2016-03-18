
var browser = new Browser();
var css = new Css();
// var pushFlag = false;

$(document).ready(function() {
    // 初始化Wallpaper对象
    initWallpaper();

    // 初始化Browser对象。
    browser.reportBrowserCss();
    browser.initBrowserList();

    // 初始化Table表格的点击事件
    initTableClickDelegate();

    // 初始化浏览器选择器的事件。
    initBrowserSelectorClickDelegate();
    initSelectComfirmClickDelegate();
});

// window.onpopstate = function(event) {
//     console.log(event.state);
//     if (event.state.state === 'select') {
//         $('.table').hide();
//         $('.browserSelector').show();
//     } else if (event.state.state === 'table') {
//         renderCssTable(event.state.obj)
//     }
// };

function initSelectComfirmClickDelegate() {
    $('.browserSelector .confirm').on('click', confirmDelegate);
    $('.browserSelector .confirm').tap(confirmDelegate);
    $('.browserSelector .browsers').delegate('.versionSelector', 'change', selectionValidation);

    function confirmDelegate() {
        var result = selectionValidation();
        if (!result) {
            return;
        }

        // 判断至少有一个可用显示的浏览器对象。
        var leastOneTag = false;
        result.map(function(item) {
            if (item.valid) {
                leastOneTag = true;
            }
        });

        if (!leastOneTag) {
            renderError(1, '请至少选择一个浏览器');
            return false;
        }

        GetBrowserCss(result);
    }

    function GetBrowserCss(browsers) {
        var validItemCount = 0;
        var browsersWithCss = browsers;

        browsersWithCss.map(function(item) {
            if (item.valid == 'selfBrowser') {
                validItemCount++;
                var virtualDiv = document.createElement('div');
                var selfBrowserCss = [];
                for (var cssItem in virtualDiv.style) {
                    selfBrowserCss.push(cssItem);
                }
                item['css'] = selfBrowserCss;
                item.platform = '您的浏览器';
                item.family = '您的浏览器';
                item.version = '您的浏览器';
                validItemCount--;
            }
            else if (item.valid) {
                validItemCount++;
                // [todo]这里需要合并到browser对象中。
                $.ajax({
                    url: 'http://markof.cn:8800/browser/',
                    // url: 'http://127.0.0.1:8800/browser/',
                    data: { 'platform': item.platform, 'family': item.family, 'version': item.version },
                    dataType: 'json',
                    success: function(data) {
                        validItemCount--;
                        item['css'] = data.cssInfo;
                        if (validItemCount == 0) {
                            renderCssTable(browsersWithCss);
                        }
                    },
                    error: function(err) {
                        validItemCount--;
                        item.valid = false;
                        if (validItemCount == 0) {
                            renderCssTable(browsersWithCss);
                        }
                    }
                });
            }
        });

        // 这里的处理，是为了，只选择了本地浏览器的情况下。
        if (validItemCount == 0) {
            renderCssTable(browsersWithCss);
        }
    }

    function selectionValidation() {
        var browsers = $('.browserSelector .browsers').children();
        var selectCount = 0;
        var invalidItem = null;
        var errorMessage = '';
        var result = [];

        for (var index = 0; index < browsers.length; index++) {
            var resultItem = { 'index': index, 'valid': false, 'platform': null, 'family': null, 'version': null };
            var browserItem = $(browsers[index]);
            var platform = browserItem.children('.platformSelector').val();
            var family = browserItem.children('.familySelector').val();
            var version = browserItem.children('.versionSelector').val();

            // 还没有任何选择
            if (typeof (platform) == 'undefined' || platform == 'unselected') {
                resultItem.valid = false;
                result.push(resultItem);
                continue;
            }

            if (platform == 'selfBrowser') {
                resultItem.valid = 'selfBrowser';
                result.push(resultItem);
                continue;
            }

            if (family == 'unselected' || version == 'unselected') {
                errorMessage = '请完整选择“浏览器”和“版本”';
                invalidItem = index + 1;
                break;
            }
            else {
                resultItem.valid = true;
                resultItem.platform = platform;
                resultItem.family = family;
                resultItem.version = version;
                clearError();
                result.push(resultItem);
            }
        }

        if (invalidItem) {
            renderError(invalidItem, errorMessage);
            return null;
        }
        else {
            return result;
        }
    }

    function clearError() {
        var parent = $('.browserSelector');
        var messageBox = parent.children('.more');
        messageBox.slideUp(function() {
            messageBox.remove();
        });
    }

    function renderError(position, message) {
        var messageBox = $('<div class="more"><div class="body"><div class="arrow arrow-position-' + position + '-4"></div><div class="message center">' + message + '</div></div></div>');
        var parent = $('.browserSelector');
        parent.children('.more').remove();
        messageBox.hide();
        parent.children('.browsers').after(messageBox);
        messageBox.slideDown();
    }
}

function initBrowserSelectorClickDelegate() {
    $('.browserSelector .browsers').delegate('.iconfont', 'click', addBrowserDelegate);
    $('.browserSelector .browsers').delegate('.platformSelector', 'change', platformSelectDelegate);
    $('.browserSelector .browsers').delegate('.familySelector', 'change', familySelectDelegate);
    $('.browsers .iconfont').tap(addBrowserDelegate);
    // $('.browsers').delegate('.versionSelector', 'change', platformSelectDelegate);

    function familySelectDelegate() {
        var browserList = browser.browserList;
        var self = $(this);
        var parent = $(self.parent());
        var selectedPlaform = parent.children('.platformSelector').val();
        var selectedFamily = self.val();
        var versionSelector = null;

        parent.children('.versionSelector').remove();

        browserList.platform.map(function(platform) {
            if (platform.code == selectedPlaform) {
                platform.browsers.map(function(family) {
                    if (family.code == selectedFamily) {
                        versionSelector = $('<select class="versionSelector"></select>');
                        versionSelector.hide();
                        versionSelector.append('<option value="unselected">请选择版本</option>');
                        family.versions.map(function(version) {
                            versionSelector.append('<option>' + version.code + '</option>')
                        });
                        parent.append(versionSelector);
                        versionSelector.fadeIn();
                    }
                });
            }
        });
    }

    function platformSelectDelegate() {
        var browserList = browser.browserList;
        var self = $(this);
        var parent = $(self.parent());
        var selectedPlaform = self.val();
        var familySelector = null;

        parent.children('.familySelector').remove();
        parent.children('.versionSelector').remove();

        browserList.platform.map(function(platform) {
            if (platform.code == selectedPlaform) {
                familySelector = $('<select class="familySelector"></select>');
                familySelector.html('');
                familySelector.hide();
                familySelector.append('<option value="unselected">请选择浏览器</option>');
                platform.browsers.map(function(family) {
                    familySelector.append('<option>' + family.code + '</option>');
                });
                parent.append(familySelector);
                familySelector.fadeIn();
            }
        });
    }

    function addBrowserDelegate() {
        var browserList = browser.browserList;
        var platformSelector = $('<select class="platformSelector"></select>');
        var self = $(this);
        var parent = $(self.parent());

        platformSelector.append('<option value="unselected">请选择操作系统</option>');
        platformSelector.append('<option value="selfBrowser">您当前的浏览器</option>');
        browserList.platform.map(function(platform) {
            platformSelector.append('<option>' + platform.code + '</option>');
        });

        platformSelector.hide();
        parent.append(platformSelector);
        $(this).fadeOut(function() {
            platformSelector.fadeIn();
        });
    }
}

function initTableClickDelegate() {
    var moreItem = $('<div class="more"></div>');
    var body = $('<div class="body"></div>');
    var arrow = $('<div class="arrow"></div>');
    var content = $('<div><div>');
    moreItem.append(body);
    body.append(arrow);
    body.append(content);

    console.log(moreItem);
    var lastRow = null;
    moreItem.hide();

    $('.table').delegate('.reSelect', 'click', function() {
        $('.table').fadeOut(function() {
            $('.browserSelector').fadeIn();
        });
    });


    $('.table').delegate('.col-title', 'click', function() {
        var target = $(this);
        lastRow && lastRow.removeClass('active');
        lastRow = target.parent();
        lastRow.addClass('active');

        moreItem.slideUp(function() {
            target.parent().after(moreItem);
            moreItem.slideDown();
        });

        css.get(target.html(), function(err, data) {
            if (err) content.html('内容待补充...');
            else content.html(data);
        });
    });
}

function unique(array) {
    var n = [];//临时数组
    for (var i = 0; i < array.length; i++) {
        if (n.indexOf(array[i]) == -1) n.push(array[i]);
    }
    return n;
}

function renderCssTable(validResult) {
    console.log(validResult);
    // [todo]这里会引入一个undifined元素。
    var allCss = [];
    var validCount = 0;
    validResult.map(function(item) {
        allCss = allCss.concat(item.css);
        if (item.valid) {
            validCount++;
        }
    });

    // 去重
    allCss = unique(allCss);

    // 去掉引入的undifined元素。
    // [todo]非常dirty的做法
    allCss.shift();

    var platformTitleRow = $('<div class="row row-title"></div>');
    var familyTitleRow = $('<div class="row row-title"></div>');
    var versionTitleRow = $('<div class="row row-title"></div>');

    platformTitleRow.append('<div class="col">平台</div>');
    familyTitleRow.append('<div class="col">浏览器</div>');
    versionTitleRow.append('<div class="col">版本</div>');

    validResult.map(function(item) {
        if (item.valid) {
            platformTitleRow.append('<div class="col">' + item.platform + '</div>');
            familyTitleRow.append('<div class="col">' + item.family + '</div>');
            versionTitleRow.append('<div class="col">' + item.version + '</div>');
        }
    });
    
    $('.table').html('<div class="reSelect"><i class="iconfont icon-true"></i> 重新选择</div>');
    $('.table').append(platformTitleRow);
    $('.table').append(familyTitleRow);
    $('.table').append(versionTitleRow);

    allCss.map(function(cssItem) {
        var newRow = $('<div class="row"></div>');
        newRow.append('<div class="col col-title">' + cssItem + '</div>');
        validResult.map(function(browserItem) {
            if (browserItem.valid) {
                var flag = (browserItem.css.indexOf(cssItem) == -1) ? 'false' : 'true';
                newRow.append('<div class="col"><i class="iconfont icon-' + flag + '"></i></div>');
            }
        });
        $('.table').append(newRow);
    });

    $('.browserSelector').fadeOut(function() {
        // if (pushFlag == false) {

        //     console.log('push state');
        //     history.replaceState({ 'state': 'select' }, null);
        //     history.pushState({ 'state': 'table', 'obj': validResult }, null, window.location.href);
        //     pushFlag = true;
        // } else {
        //     history.replaceState({ 'state': 'table', 'obj': validResult },null);
        // }
        $('.table').fadeIn();
    });
}

function initWallpaper() {
    var bg = new wallpaper();
    bg.getRandomWallpaper(function(err, data) {
        if (err) return;
        var img = new Image();
        img.onload = function() { //图片下载完毕时异步调用callback函数。
            $('.cover').css({ 'background-color': 'rgba(0,0,0,1)' });
            $('body').css({ 'background-image': 'url(' + data.response.image.preview.url + ')' });
            var alpha = 100;
            var instans = setInterval(function() {
                $('.cover').css({ 'background-color': 'rgba(0,0,0,' + alpha / 100 + ')' });
                alpha--;
                if (alpha < 65) {
                    clearInterval(instans);
                }
            }, 100);
        };
        img.onerror = function(err) { console.log(err); }
        img.src = data.response.image.preview.url;
    });
}
