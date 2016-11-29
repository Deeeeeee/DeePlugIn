"use strict";
var gulp = require('gulp');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sass = require('gulp-sass');

var path = {
    sass:["*.scss"],
    css:['*']
};



gulp.task('css',function  () {
    return	gulp.src(path.css)
        .pipe(gulp.dest('static/css'))
});

gulp.task('sass',function () {
    return 	gulp.src(path.sass)
        .pipe(sass())
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest('./'));
});

gulp.task('watch',["sass"],function () {
    gulp.watch(path.sass,['sass']);
});

gulp.task('default', ['watch']);