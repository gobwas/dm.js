var gulp = require("gulp"),
    RSVP = require("rsvp"),
    _    = require("lodash");

gulp.task("clean", function(done) {
    var del = require("del");

    del([
        "./tmp",
        "./web-test/testling.js"
    ], done);
});

gulp.task("browserify:testling", function(done) {
    var browserify = require('browserify'),
        source     = require("vinyl-source-stream"),
        buffer     = require("vinyl-buffer"),
        glob       = require("glob"),
        rename     = require("gulp-rename"),
        eos        = require("end-of-stream"),
        path       = require("path"),
        File       = require("vinyl");

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
            var bundler, stream, contents, file;

            contents = Buffer.concat(files.map(function(file) {
                return new Buffer("require('" + file + "');");
            }));

            bundler = browserify({
                debug: true
            });

            bundler.external("vertx");
            bundler.external("jsdom");
            bundler.require(new File({ contents: new Buffer("function noop(){}; module.exports={ readFile: noop};") }), { expose: "fs" });

            file = new File({
                contents: contents
            });

            bundler.add(file);

            stream = bundler
                .bundle()
                .pipe(source("testling.js"))
                .pipe(buffer())
                .pipe(gulp.dest("./web-test"));

            return new RSVP.Promise(function(resolve, reject) {
                eos(stream, function(err) {
                    if (err) {
                        reject(err);
                        return;
                    }

                    resolve();
                });
            });
        })
        .then(done, done);
});

gulp.task("mocha", function() {
    var mocha = require("gulp-mocha");

    return gulp
        .src(["./test/**/*.js"])
        .pipe(mocha({

        }));
});

gulp.task("lint", function() {
    var jshint      = require("gulp-jshint"),
        through2    = require("through2"),
        PluginError = require("gulp-util").PluginError,
        errors;

    errors = [];

    return gulp
        .src(["./src/**/*.js"])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(through2.obj(
            function(file, enc, done) {
                var jshint, isError;

                // check for failure
                if ((jshint = file.jshint) && !jshint.success && !jshint.ignored) {
                    isError = _.any(jshint.results, function(result) {
                        try {
                            return result.error.code[0] === "E";
                        } catch (err) {
                            return false;
                        }
                    });

                    if (isError) {
                        errors.push(file.path);
                    }
                }

                done(null, file);
            },
            function(done) {
                if (errors.length > 0) {
                    this.emit('error', new PluginError('gulp-jshint', {
                        message: 'JSHint failed for: \n' + errors.join(',\n'),
                        showStack: false
                    }));
                }

                done();
            }
        ));
});

gulp.task("style", function () {
    var jscs = require("gulp-jscs");

    return gulp
        .src(["./src/**/*.js"])
        .pipe(jscs());
});

gulp.task("test", function(done) {
    var runSequence = require("run-sequence");

    runSequence(
        "clean",
        "lint",
        "style",
        "mocha",
        done
    );
});

gulp.task("testling", function(done) {
    var runSequence = require("run-sequence");

    runSequence(
        "clean",
        "lint",
        "style",
        "browserify:testling",
        done
    );
});