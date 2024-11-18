const gulp = require('gulp');
const concat = require('gulp-concat-css');
const plumber = require('gulp-plumber');
const del = require('del');
const browserSync = require('browser-sync').create();

function serve() {
  browserSync.init({
    server: {
      baseDir: './dist',
      serveStaticOptions: {
        extensions: ['html'],
      },
    },
    port: 9000,
    ui: { port: 9001 },
    open: true,
  });
}

function html() {
  return gulp
    .src('src/**/*.html')
    .pipe(plumber())
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.reload({ stream: true }));
}

function css() {
  return gulp
    .src('src/style.css')
    .pipe(plumber())
    .pipe(concat('bundle.css'))
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.reload({ stream: true }));
}

function images() {
  return gulp
    .src('src/images/*.{jpg,png,svg,gif,ico,webp,avif}')
    .pipe(plumber())
    .pipe(gulp.dest('dist/images/'));
}

function fonts() {
  return gulp
    .src('src/fonts/*.{eot,ttf,woff,woff2,svg}')
    .pipe(plumber())
    .pipe(gulp.dest('dist/fonts/'));
}

function clean() {
  return del('dist');
}

function watchFiles() {
  gulp.watch(['src/**/*.html'], html);
  gulp.watch(['src/style.css'], css);
  gulp.watch(['src/fonts/fonts.css'], css);
  gulp.watch(['src/blocks/**/*.css'], css);
  gulp.watch(['src/images/**/*'], images);
  gulp.watch(['src/fonts/**/*'], fonts);
}

const build = gulp.series(clean, gulp.parallel(images, html, fonts, css));
const watchapp = gulp.parallel(build, watchFiles, serve);

exports.html = html;
exports.css = css;
exports.images = images;
exports.fonts = fonts;
exports.clean = clean;
exports.serve = serve;
exports.build = build;
exports.watchapp = watchapp;
