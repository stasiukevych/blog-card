const log = require('fancy-log');
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');

const sync = require('browser-sync').create();

// compile sass from docs folder
function compile() {
    return gulp.src('docs/scss/**/*.scss', {sourcemaps: true})
        .pipe(sass({
            logger: {
                debug: (msg) => log.info('[SCSS Debug]:', msg)
            }
        }, undefined).on('error', sass.logError))
        .pipe(postcss([cssnano()]))
        .pipe(gulp.dest('docs/css', {sourcemaps: '.'}));
}

// watching a file changes from docs folder
function watch() {
    gulp.watch('*.html', reload);
    gulp.watch(['docs/scss/**/*.scss'], gulp.series(compile, reload));
}

function reload(cb) {
    sync.reload(undefined);
    cb();
}

// start browser listen a changes from docs folder
async function serve(cb) {
    await sync.init({
        server: {
            baseDir: 'docs'
        }
    });
    cb();
}

exports.default = gulp.series(compile, serve, watch);