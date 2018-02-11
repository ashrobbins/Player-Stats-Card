/* GULPFILE
**************************************************/
var gulp = require('gulp'),

    sass = require('gulp-sass'),
    autoprefix = require('gulp-autoprefixer'),

    scss_prefix = 'last 5 versions',

    scss_src = "./scss/**/",
    css_dist = "./css/";


/* CSS
---------------------*/
gulp.task('sass', function () {
    gulp.src(scss_src + '*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefix({
            browsers: [scss_prefix]
        }))
        .pipe(gulp.dest(css_dist));
});


/* WATCHERS
---------------------*/
// Watch files for changes and run the appropriate task
gulp.task('watch_sass', function () {
    gulp.watch(scss_src + '*.scss', ['sass']);
});


/* DEFAULT TASK
---------------------*/
gulp.task('default', ['sass', 'watch_sass']);
