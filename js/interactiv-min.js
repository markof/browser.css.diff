function initSelectComfirmClickDelegate(){function e(){var e=l();if(e){var o=!1;return e.map(function(e){e.valid&&(o=!0)}),o?void r(e):(a(1,"请至少选择一个浏览器"),!1)}}function r(e){var r=0,o=e;o.map(function(e){if("selfBrowser"==e.valid){r++;var l=document.createElement("div"),n=[];for(var a in l.style)n.push(a);e.css=n,e.platform="您的浏览器",e.family="您的浏览器",e.version="您的浏览器",r--}else e.valid&&(r++,$.ajax({url:"http://markof.cn:8800/browser/",data:{platform:e.platform,family:e.family,version:e.version},dataType:"json",success:function(l){r--,e.css=l.cssInfo,0==r&&i(o)},error:function(l){r--,e.valid=!1,0==r&&i(o)}}))}),0==r&&i(o)}function o(e){for(var r=[],o=0;o<e.length;o++)-1==r.indexOf(e[o])&&r.push(e[o]);return r}function i(e){var r=[],i=0;e.map(function(e){r=r.concat(e.css),e.valid&&i++}),r=o(r),r.shift();var l=$('<div class="row row-title"></div>'),n=$('<div class="row row-title"></div>'),a=$('<div class="row row-title"></div>');l.append('<div class="col">平台</div>'),n.append('<div class="col">浏览器</div>'),a.append('<div class="col">版本</div>'),e.map(function(e){e.valid&&(l.append('<div class="col">'+e.platform+"</div>"),n.append('<div class="col">'+e.family+"</div>"),a.append('<div class="col">'+e.version+"</div>"))}),$(".table").append(l),$(".table").append(n),$(".table").append(a),r.map(function(r){var o=$('<div class="row"></div>');o.append('<div class="col col-title">'+r+"</div>"),e.map(function(e){if(e.valid){var i=-1==e.css.indexOf(r)?"false":"true";o.append('<div class="col"><i class="iconfont icon-'+i+'"></i></div>')}}),$(".table").append(o)}),$(".browserSelector").fadeOut(function(){var e="请选择浏览器",r="./";history.pushState("",e,r),$(".table").fadeIn()})}function l(){for(var e=$(".browserSelector .browsers").children(),r=null,o="",i=[],l=0;l<e.length;l++){var t={index:l,valid:!1,platform:null,family:null,version:null},s=$(e[l]),c=s.children(".platformSelector").val(),d=s.children(".familySelector").val(),p=s.children(".versionSelector").val();if("undefined"!=typeof c&&"unselected"!=c)if("selfBrowser"!=c){if("unselected"==d||"unselected"==p){o="请完整选择“浏览器”和“版本”",r=l+1;break}t.valid=!0,t.platform=c,t.family=d,t.version=p,n(),i.push(t)}else t.valid="selfBrowser",i.push(t);else t.valid=!1,i.push(t)}return r?(a(r,o),null):i}function n(){var e=$(".browserSelector"),r=e.children(".more");r.slideUp(function(){r.remove()})}function a(e,r){var o=$('<div class="more"><div class="body"><div class="arrow arrow-position-'+e+'-4"></div><div class="message center">'+r+"</div></div></div>"),i=$(".browserSelector");i.children(".more").remove(),o.hide(),i.children(".browsers").after(o),o.slideDown()}$(".browserSelector .confirm").on("click",e),$(".browserSelector .confirm").tap(e),$(".browserSelector .browsers").delegate(".versionSelector","change",l)}function initBrowserSelectorClickDelegate(){function e(){var e=browser.browserList,r=$(this),o=$(r.parent()),i=o.children(".platformSelector").val(),l=r.val(),n=null;o.children(".versionSelector").remove(),e.platform.map(function(e){e.code==i&&e.browsers.map(function(e){e.code==l&&(n=$('<select class="versionSelector"></select>'),n.hide(),n.append('<option value="unselected">请选择版本</option>'),e.versions.map(function(e){n.append("<option>"+e.code+"</option>")}),o.append(n),n.fadeIn())})})}function r(){var e=browser.browserList,r=$(this),o=$(r.parent()),i=r.val(),l=null;o.children(".familySelector").remove(),o.children(".versionSelector").remove(),e.platform.map(function(e){e.code==i&&(l=$('<select class="familySelector"></select>'),l.html(""),l.hide(),l.append('<option value="unselected">请选择浏览器</option>'),e.browsers.map(function(e){l.append("<option>"+e.code+"</option>")}),o.append(l),l.fadeIn())})}function o(){var e=browser.browserList,r=$('<select class="platformSelector"></select>'),o=$(this),i=$(o.parent());r.append('<option value="unselected">请选择操作系统</option>'),r.append('<option value="selfBrowser">您当前的浏览器</option>'),e.platform.map(function(e){r.append("<option>"+e.code+"</option>")}),r.hide(),i.append(r),$(this).fadeOut(function(){r.fadeIn()})}$(".browserSelector .browsers").delegate(".iconfont","click",o),$(".browserSelector .browsers").delegate(".platformSelector","change",r),$(".browserSelector .browsers").delegate(".familySelector","change",e),$(".browsers .iconfont").tap(o)}function initTableClickDelegate(){var e=$('<div class="more"><div class="body"><div class="arrow"></div><div class="">等待添加内容...</div></div></div>'),r=null;e.hide(),$(".table").delegate(".col-title","click",function(){var o=this;r&&r.removeClass("active"),r=$(o).parent(),r.addClass("active"),e.slideUp(function(){$(o).parent().after(e),e.slideDown()})})}function initWallpaper(){var e=new wallpaper;e.getRandomWallpaper(function(e,r){if(!e){var o=new Image;o.onload=function(){$(".cover").css({"background-color":"rgba(0,0,0,1)"}),$("body").css({"background-image":"url("+r.response.image.preview.url+")"});var e=100,o=setInterval(function(){$(".cover").css({"background-color":"rgba(0,0,0,"+e/100+")"}),e--,65>e&&clearInterval(o)},100)},o.onerror=function(e){console.log(e)},o.src=r.response.image.preview.url}})}var browser=new Browser;$(document).ready(function(){initWallpaper(),browser.reportBrowserCss(),browser.initBrowserList(),initTableClickDelegate(),initBrowserSelectorClickDelegate(),initSelectComfirmClickDelegate()});