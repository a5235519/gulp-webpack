var fs = require('fs');
var path = require('path');

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    argv = require('yargs').argv,
    replace      = require('gulp-replace'),
    imagemin   = require('gulp-imagemin'),
    pngquant   = require('imagemin-pngquant'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    minifyCSS = require('gulp-minify-css'),
    browserSync = require('browser-sync'),
    webpack = require('webpack'),
    gutil = require('gulp-util'),
    cleanCSS = require('gulp-clean-css'),

    webpackConfig = require('./webpack.config')

var ipath = {
    devPath: './dist',
    serverPath: '../dev',
    imgDevPath: ''
}
var devWatch = [
    './src/*',
    './src/**/*',
    './src/**/**/*',
    '!./src/assets/css/sprite/sprite.css'
]

/*
webpack基础配置功能：webpack.config.js
    加载器生成CSS、html、JS文件、图片转换base64、合并雪碧图等

gulp处理分为两种模式：
    开发模式 和 发布模式

    开发模式：webpack打包的同时，搭建静态环境，同步刷新
    发布模式：压缩CSS、JS并移动到发布目录
*/

// 开发模式:webpack打包
gulp.task('webpack', function(callback){
    webpack(webpackConfig).run((err, stats)=>{
        if(err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString());
        callback();
    });
})

// 开发模式: browserSync 实时更新
gulp.task('bs', () => {
    browserSync.init({
        server:"./",
        index: '/index.html',
        port: 3000,
        open: false,
        files: [ipath.devPath+"/js/**/*.js", ipath.devPath+"/css/**.css", ipath.devPath+"/*.html", ipath.devPath+"/images/*.{jpg,gif,png,jpeg,ico}"] //监控变化
    });
})

// 开发模式执行
gulp.task('default', ['bs', 'webpack'], () => {
    gulp.watch(devWatch, () => {
        gulp.run('webpack')
    });
})

// 发布模式：CSS压缩
gulp.task('cssMin',() => {
    gulp.src(ipath.devPath+'/css/*')
        // .pipe(replace('../images/', ipath.imgDevPath+'img/'))
        .pipe(cleanCSS())
        .pipe(gulp.dest(ipath.serverPath+'/css'));
});

// 发布模式：HTML文件移动
gulp.task('copyHTML', () => {
    return gulp.src(ipath.devPath+'/*.html')
    .pipe(gulp.dest(ipath.serverPath))
});

// 发布模式：JS文件移动
// 需添加功能：此处只需要最近日期的JS文件，其他JS文件概不移动
gulp.task('copyJS', () => {
    return gulp.src(ipath.devPath+'/js/*.js')
    .pipe(gulp.dest(ipath.serverPath+'/js'))
});

// 发布模式：图片移动并压缩
gulp.task('imgMoveMin', function () {
  return gulp.src(ipath.devPath+'/images/*.{jpg,gif,png,jpeg,ico}')
    //.pipe(imagemin({optimizationLevel: 5}))
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest(ipath.serverPath+'/images'));
});

// 发布模式执行
gulp.task('dev', () => {
    gulp.run('cssMin', 'copyHTML', 'copyJS', 'imgMoveMin');
})

