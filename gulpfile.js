const gulp = require('gulp');
const concat = require('gulp-concat-css');
const plumber = require('gulp-plumber');
const del = require('del');
const browserSync = require('browser-sync').create();
// PostCSS и его плагины
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const mediaquery = require('postcss-combine-media-query');
const cssnano = require('cssnano');

const htmlMinifier = require('html-minifier');


function serve() {
  browserSync.init({
    server: {
      baseDir: './dist',
    },
  });
}

function html() {
    const options = {
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        sortClassName: true,
        useShortDoctype: true,
        collapseWhitespace: true,
          minifyCSS: true,
          keepClosingSlash: true
    };

  return gulp
    .src('src/**/*.html')
    .pipe(plumber())
    .on('data', function(file) {
        const buferFile = Buffer.from(htmlMinifier.minify(file.contents.toString(), options))
        return file.contents = buferFile
      })
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.reload({ stream: true }));
}

function fonts() {
  return gulp
    .src('src/fonts/**/*.{woff,woff2,ttf}')
    .pipe(gulp.dest('dist/fonts'))
    .pipe(browserSync.reload({ stream: true }));
}

function css() {
    const plugins = [
        autoprefixer(),
        mediaquery(),
        cssnano()
    ];

    return gulp
        .src('src/style.css')
        .pipe(plumber())
        .pipe(concat('bundle.css'))
        .pipe(postcss(plugins))
        .pipe(gulp.dest('dist/'))
        .pipe(browserSync.reload({ stream: true }));
}

function images() {
  return gulp
    .src('src/images/**/*.{jpg,png,svg,gif,ico,webp,avif}')
    .pipe(gulp.dest('dist/images'))
    .pipe(browserSync.reload({ stream: true }));
}

function clean() {
  return del('dist');
}

function watchFiles() {
  gulp.watch(['src/**/*.html'], html);
  gulp.watch(['src/blocks/**/*.css'], css);
  gulp.watch(['src/images/**/*.{jpg,png,svg,gif,ico,webp,avif}'], images);
  gulp.watch(['src/fonts/**/*.{woff,woff2,ttf}'], fonts);
}

const build = gulp.series(clean, gulp.parallel(html, fonts, css, images));
const watchapp = gulp.parallel(build, watchFiles, serve);

exports.html = html;
exports.fonts = fonts;
exports.css = css;
exports.images = images;
exports.clean = clean;

exports.watchapp = watchapp;
exports.build = build;
