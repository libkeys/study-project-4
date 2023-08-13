const gulp = require('gulp')
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer')
const cssnano = require('gulp-cssnano');
const browserSync = require('browser-sync')
const concat = require('gulp-concat')
const minify = require('gulp-minify')
const del = require('del')

function scss() {
    return gulp
        .src('src/scss/**/*.scss')
        .pipe(sass())
        .pipe(
            autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
                cascade: true
            })
        )
        .pipe(cssnano())
        .pipe(gulp.dest('dist/'))
        .pipe(browserSync.reload({ stream: true }))
}

function js() {
    return gulp
        .src('src/js/**/*.js')
        .pipe(concat('script.js'))
        .pipe(minify())
        .pipe(gulp.dest('dist/'))
        .pipe(browserSync.reload({ stream: true }))
}

function imagesCopy(){
    return gulp
    .src('src/img/**/*')
    .pipe(gulp.dest('media/img'))
}

function clean() {
    return del(__dirname + '/dist')
}

function browserSyncFunction() {
    browserSync({
        server: {
            baseDir: __dirname + '/'
        },
        notify: false
    })
}

// function watchFiles() {
//     gulp.watch(['./src/scss/**/*.scss'], gulp.series(scss,js))
//     gulp.watch(['./src/js/**/*.js'], js)
//     gulp.watch(['./**/*.html'], js)
// }


function watchFiles() {
    gulp.watch(['./src/scss/**/*.scss'], gulp.series(scss,js))
    gulp.watch(['./src/js/**/*.js'], js)
    gulp.watch(['./src/img/**/*'], imagesCopy)
    gulp.watch(['./**/*.html'], js)
}

let build = gulp.series(gulp.parallel(scss, browserSyncFunction))
let watch = gulp.parallel(build, watchFiles, browserSyncFunction)

let start = gulp.series(clean, gulp.parallel(scss, js, watchFiles, browserSyncFunction))
let startNoBrowser = gulp.series(clean, gulp.parallel(scss, js, watchFiles))

exports.imagesCopy = imagesCopy
exports.execute = startNoBrowser
exports.back = startNoBrowser
exports.clean = clean
exports.start = start
exports.js = js
exports.build = build
exports.watch = watch
exports.default = start