var gulp = require("gulp");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var watchify = require("watchify");
var tsify = require("tsify");
var gutil = require("gulp-util");
var paths = {
    pages: ['src/*.html']
};

var csspaths = {
    pages: ['src/*.css']
};

var imagepaths = {
    pages: ['src/assets/*']
};
var watchedBrowserify = watchify(browserify({
    basedir: '.',
    debug: true,
    entries: ['src/main.ts'],
    cache: {},
    packageCache: {}
}).plugin(tsify));

gulp.task("copy-html", function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest("dist"));
});

gulp.task("copy-css", function () {
    return gulp.src(csspaths.pages)
        .pipe(gulp.dest("dist"));
});

gulp.task("copy-image", function () {
    return gulp.src(imagepaths.pages)
        .pipe(gulp.dest("dist/assets"));
});

function bundle() {
    return watchedBrowserify
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest("dist"));
}

gulp.task("default", ["copy-html", "copy-css", "copy-image"], bundle);
watchedBrowserify.on("update", bundle);
watchedBrowserify.on("log", gutil.log);