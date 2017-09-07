'use strict';
/* Настроен под проэкт ДЗ 7-8 */
var gulp = require('gulp');
var sass = require('gulp-sass');
var connect = require('gulp-connect');
var concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
var rm = require( 'gulp-rm' );
var rigger = require('gulp-rigger');
const babel = require('gulp-babel');
var browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');
var svgSprite = require("gulp-svg-sprites");

gulp.task('sprites', function () {
    return gulp.src('src/svg/*.svg')
        .pipe(svgSprite({mode: "symbols"}))
        .pipe(gulp.dest("dist/img"));
});

gulp.task('imgMin', () =>
        gulp.src('src/images/**')
            .pipe(imagemin())
            .pipe(gulp.dest('dist/img'))
);
// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./dist"
        },
        open: false
    });
});
gulp.task('bs-reload',['bundleHtml','sass','bundleJs'], function (done) {
    browserSync.reload();
    done();
});

gulp.task('sass', function () {
    return gulp.src('./src/sass/style.scss')
        .pipe(rigger())
        .pipe(sass({outputStyle: 'expanded',
            includePaths: ['node_modules/susy/sass']
        })
            .on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('dist/css'));
});

gulp.task( 'clean', function() {
    return gulp.src( 'dist/**', { read: false })
        .pipe( rm() )
});

gulp.task('bundleHtml', function () {
    return gulp.src('src/html/index.html')
        .pipe(rigger())
        .pipe(gulp.dest('dist/'));
});

gulp.task('bundleJs', () => {
    return gulp.src('src/js/script.js')
		.pipe(rigger())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('dist/js'));
});
gulp.task('JsMod', () => {
    return gulp.src('src/js-mod/*.*')
        .pipe(gulp.dest('dist/js'));
});
gulp.task('copyFont', () => {
    return gulp.src('src/fonts/**')
        .pipe(gulp.dest('dist/fonts'));
});
gulp.task('watch',['sprites','JsMod','copyFont','imgMin','bundleHtml','sass','bundleJs', 'browser-sync'], function () {
    gulp.watch('./src/html/*.html', ['bs-reload']);
    gulp.watch('./src/sass/*.scss', ['bs-reload']);
    gulp.watch('./src/js/*.js', ['bs-reload']);
    gulp.watch('./src/images/*', ['imgMin']);
    //gulp.watch('./dist/**/*', ['bs-reload']);
});
gulp.task('runBuild',['clean'], function () {
 gulp.run('watch');
});
gulp.task('default', ['runBuild']);