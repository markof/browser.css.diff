/**
 * gulpfile.js
 * 项目构建文件
 * author:markof
 * email:markof@163.com
 * github: https://github.com/markof
 * date:2016.3.7
 */

'use strict'

const gulp = require('gulp');

// 最小化html文件
const htmlmin = require('gulp-htmlmin');

// 预处理Less
const less = require('gulp-less');

// 最小化CSS
const cssmin = require('gulp-cssmin');

// 静态资源映射，并打码MD5
const rev = require('gulp-rev');

// 最小化JS文件
/**
 * gulp-minify 有个一个待确认的bug。
 * 即，传入ignorefiles参数后，在文件列表中，一旦有个文件符合，则剩下的带处理文件将一并被忽略。
 */
const jsmin = require('gulp-minify');

// 默认处理任务
gulp.task('default', ['webtask']);

// web部分的处理任务
gulp.task('webtask',function(){
    // 处理html代码
    gulp.src('src/index.html')
        // 最小化HTML代码，删除多余空格和注释
        .pipe(htmlmin({removeComments:true,collapseWhitespace:true}))
        // 输出代码到分支web所在的目录
        .pipe(gulp.dest('../web/'));
        
    // 处理CSS代码
    gulp.src('src/less/style.less')
        // LESS预编译
        .pipe(less())
        // 最小化CSS
        .pipe(cssmin())
        // 输出到CSS文件夹下
        .pipe(gulp.dest('../web/css/'));
    
    // 处理js代码
    gulp.src('src/js/*.*')
        .pipe(jsmin())
        .pipe(gulp.dest('../web/js/'));
    
    // 处理字体文件
    gulp.src('src/font/*.*')
        .pipe(gulp.dest('../web/font/'));
});

gulp.watch('src/**/*.*', ['webtask']);