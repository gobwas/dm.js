var gulp = require("gulp"),
    RSVP = require("rsvp");

gulp.task("clean", function(done) {
    var del = require("del");

    del([
        "./tmp",
        "./web-test/testling.js"
    ], done);
});

gulp.task("testling", function(done) {
    var browserify = require('browserify'),
        source     = require("vinyl-source-stream"),
        buffer     = require("vinyl-buffer"),
        glob       = require("glob"),
        bundler;

    new RSVP
        .Promise(function(resolve, reject) {
            glob("./test/**/*.js", function(err, files) {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(files);
            });
        })
        .then(function(files) {
            console.log("BUNDLINGS", files);
            bundler = browserify({
                entries: files,
                debug: true
            });

            bundler.external("jsdom");
            bundler.external("vertx");

            return bundler
                .bundle()
                .pipe(source("testling.js"))
                .pipe(buffer())
                .pipe(gulp.dest("./web-test"));
        })
        .then(function(stream) {
            eos(stream, done);
        });
});

gulp.task("mocha", function() {
    var mocha = require("gulp-mocha");

    return gulp
        .src(["./test/**/*.js"])
        .pipe(mocha({

        }));
});

gulp.task("lint", function() {
    var jshint = require("gulp-jshint");

    return gulp
        .src(["./src/**/*.js"])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail')); // todo custom
});


gulp.task("style", function () {
    var jscs = require("gulp-jscs");

    return gulp
        .src(["./src/**/*.js"])
        .pipe(jscs());
});