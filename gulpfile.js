const log = require('fancy-log');
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');

const sync = require('browser-sync').create();

// compile sass from app folder
function compile() {
    return gulp.src('app/scss/**/*.scss', {sourcemaps: true})
        .pipe(sass({
            logger: {
                debug: (msg) => log.info('[SCSS Debug]:', msg)
            }
        }, undefined).on('error', sass.logError))
        .pipe(postcss([cssnano()]))
        .pipe(gulp.dest('app/css', {sourcemaps: '.'}));
}

// watching a file changes from app folder
function watch() {
    gulp.watch('*.html', reload);
    gulp.watch(['app/scss/**/*.scss'], gulp.series(compile, reload));
}

function reload(cb) {
    sync.reload(undefined);
    cb();
}

// start browser listen a changes from app folder
async function serve(cb) {
    await sync.init({
        server: {
            baseDir: 'app'
        }
    });
    cb();
}

exports.default = gulp.series(compile, serve, watch);