function initSelectComfirmClickDelegate(){function e(){var e=r();if(e){var l=!1;return e.map(function(e){e.valid&&(l=!0)}),l?void o(e):(n(1,"请至少选择一个浏览器"),!1)}}function o(e){var o=0,r=e;r.map(function(e){if("selfBrowser"==e.valid){o++;var l=document.createElement("div"),n=[];for(var a in l.style)n.push(a);e.css=n,e.platform="您的浏览器",e.family="您的浏览器",e.version="您的浏览器",o--}else e.valid&&(o++,$.ajax({url:"http://markof.cn:8800/browser/",data:{platform:e.platform,family:e.family,version:e.version},dataType:"json",success:function(l){o--,e.css=l.cssInfo,0==o&&renderCssTable(r)},error:function(l){o--,e.valid=!1,0==o&&renderCssTable(r)}}))}),0==o&&renderCssTable(r)}function r(){for(var e=$(".browserSelector .browsers").children(),o=null,r="",a=[],t=0;t<e.length;t++){var i={index:t,valid:!1,platform:null,family:null,version:null},s=$(e[t]),c=s.children(".platformSelector").val(),d=s.children(".familySelector").val(),p=s.children(".versionSelector").val();if("undefined"!=typeof c&&"unselected"!=c)if("selfBrowser"!=c){if("unselected"==d||"unselected"==p){r="请完整选择“浏览器”和“版本”",o=t+1;break}i.valid=!0,i.platform=c,i.family=d,i.version=p,l(),a.push(i)}else i.valid="selfBrowser",a.push(i);else i.valid=!1,a.push(i)}return o?(n(o,r),null):a}function l(){var e=$(".browserSelector"),o=e.children(".more");o.slideUp(function(){o.remove()})}function n(e,o){var r=$('<div class="more"><div class="body"><div class="arrow arrow-position-'+e+'-4"></div><div class="message center">'+o+"</div></div></div>"),l=$(".browserSelector");l.children(".more").remove(),r.hide(),l.children(".browsers").after(r),r.slideDown()}$(".browserSelector .confirm").on("click",e),$(".browserSelector .confirm").tap(e),$(".browserSelector .browsers").delegate(".versionSelector","change",r)}function initBrowserSelectorClickDelegate(){function e(){var e=browser.browserList,o=$(this),r=$(o.parent()),l=r.children(".platformSelector").val(),n=o.val(),a=null;r.children(".versionSelector").remove(),e.platform.map(function(e){e.code==l&&e.browsers.map(function(e){e.code==n&&(a=$('<select class="versionSelector"></select>'),a.hide(),a.append('<option value="unselected">请选择版本</option>'),e.versions.map(function(e){a.append("<option>"+e.code+"</option>")}),r.append(a),a.fadeIn())})})}function o(){var e=browser.browserList,o=$(this),r=$(o.parent()),l=o.val(),n=null;r.children(".familySelector").remove(),r.children(".versionSelector").remove(),e.platform.map(function(e){e.code==l&&(n=$('<select class="familySelector"></select>'),n.html(""),n.hide(),n.append('<option value="unselected">请选择浏览器</option>'),e.browsers.map(function(e){n.append("<option>"+e.code+"</option>")}),r.append(n),n.fadeIn())})}function r(){var e=browser.browserList,o=$('<select class="platformSelector"></select>'),r=$(this),l=$(r.parent());o.append('<option value="unselected">请选择操作系统</option>'),o.append('<option value="selfBrowser">您当前的浏览器</option>'),e.platform.map(function(e){o.append("<option>"+e.code+"</option>")}),o.hide(),l.append(o),$(this).fadeOut(function(){o.fadeIn()})}$(".browserSelector .browsers").delegate(".iconfont","click",r),$(".browserSelector .browsers").delegate(".platformSelector","change",o),$(".browserSelector .browsers").delegate(".familySelector","change",e),$(".browsers .iconfont").tap(r)}function initTableClickDelegate(){var e=$('<div class="more"></div>'),o=$('<div class="body"></div>'),r=$('<div class="arrow"></div>'),l=$("<div><div>");e.append(o),o.append(r),o.append(l),console.log(e);var n=null;e.hide(),$(".table").delegate(".col-title","click",function(){var o=$(this);n&&n.removeClass("active"),n=o.parent(),n.addClass("active"),e.slideUp(function(){o.parent().after(e),e.slideDown()}),css.get(o.html(),function(e,o){e?l.html("内容待补充..."):l.html(o)})})}function unique(e){for(var o=[],r=0;r<e.length;r++)-1==o.indexOf(e[r])&&o.push(e[r]);return o}function renderCssTable(e){var o=[],r=0;e.map(function(e){o=o.concat(e.css),e.valid&&r++}),o=unique(o),o.shift();var l=$('<div class="row row-title"></div>'),n=$('<div class="row row-title"></div>'),a=$('<div class="row row-title"></div>');l.append('<div class="col">平台</div>'),n.append('<div class="col">浏览器</div>'),a.append('<div class="col">版本</div>'),e.map(function(e){e.valid&&(l.append('<div class="col">'+e.platform+"</div>"),n.append('<div class="col">'+e.family+"</div>"),a.append('<div class="col">'+e.version+"</div>"))}),$(".table").append(l),$(".table").append(n),$(".table").append(a),o.map(function(o){var r=$('<div class="row"></div>');r.append('<div class="col col-title">'+o+"</div>"),e.map(function(e){if(e.valid){var l=-1==e.css.indexOf(o)?"false":"true";r.append('<div class="col"><i class="iconfont icon-'+l+'"></i></div>')}}),$(".table").append(r)}),$(".browserSelector").fadeOut(function(){history.replaceState({state:"select"},null),history.pushState({state:"table",obj:e},null,window.location.href+"?table"),$(".table").fadeIn()})}function initWallpaper(){var e=new wallpaper;e.getRandomWallpaper(function(e,o){if(!e){var r=new Image;r.onload=function(){$(".cover").css({"background-color":"rgba(0,0,0,1)"}),$("body").css({"background-image":"url("+o.response.image.preview.url+")"});var e=100,r=setInterval(function(){$(".cover").css({"background-color":"rgba(0,0,0,"+e/100+")"}),e--,65>e&&clearInterval(r)},100)},r.onerror=function(e){console.log(e)},r.src=o.response.image.preview.url}})}var browser=new Browser,css=new Css;$(document).ready(function(){initWallpaper(),browser.reportBrowserCss(),browser.initBrowserList(),initTableClickDelegate(),initBrowserSelectorClickDelegate(),initSelectComfirmClickDelegate()}),window.onpopstate=function(e){console.log("onpopstate"),console.log(e.state),"select"===e.state.state?($(".table").hide(),$(".browserSelector").show()):"table"===e.state.state&&renderCssTable(e.state.obj)};