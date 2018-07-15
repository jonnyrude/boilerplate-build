/* eslint-env node */

// Single Sass file for all css using @import
const mainSassFile = './sass/main.scss';


const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');

gulp.task('copy-html', function () {
    return gulp.src('./index.html')
        .pipe(gulp.dest('./dist'));
});

gulp.task('copy-images', function () {
    return gulp.src('./img/*')
        .pipe(imagemin({
            progressive: true,
            use: [pngquant()]
        }))
        .pipe(gulp.dest('./dist/img'));
});

gulp.task('scripts', function () {
    return gulp.src('./js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(concat('all.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('scripts-dist', function () {
    return gulp.src('./js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('styles', function styles() {
    // for PostCSS to use
    let plugins = [
        autoprefixer()
    ];

    return gulp.src(mainSassFile)
        .pipe(sourcemaps.init())
        .pipe(sass({
            'outputStyle': 'compressed'
        }).on('error', sass.logError))
        .pipe(postcss(plugins))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
});

// gulp.task('start-browser-sync', function () {
//     return browserSync.init({
//         server: './'
//     });
// });

// gulp.series(gulp.parallel('styles', 'copy-html', 'scripts')),

gulp.task('refresh', function () {
    return browserSync.reload();
});

gulp.task('default', function () {
    gulp.watch('sass/*.scss').on('change', gulp.series(gulp.parallel('styles')));
    gulp.watch('js/**/*.js').on('change', gulp.series('scripts', 'refresh'));
    gulp.watch('*.html').on('change', gulp.series('copy-html', 'refresh'));
    // not automaticall moving the images...

    browserSync.init({
        server: './dist'
    });
});

// Ready for distribution
gulp.task('dist', gulp.series(gulp.parallel('copy-html', 'copy-images', 'styles', 'scripts-dist')));

// Consider Gzip for compressing before sent to the browser

// Consider the transpiler 'BabelJS' to translate ES6 into
// older versions of JS