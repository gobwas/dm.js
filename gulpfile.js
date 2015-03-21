var gulp = require("gulp"),
    RSVP = require("rsvp"),
    _    = require("lodash");

gulp.task("clean", function(done) {
    var del = require("del");

    del([
        "./tmp",
        "./test/web/test.js"
    ], done);
});

function webTest(options, done) {
    var browserify = require('browserify'),
        source     = require("vinyl-source-stream"),
        buffer     = require("vinyl-buffer"),
        glob       = require("glob"),
        rename     = require("gulp-rename"),
        uglify     = require("gulp-uglify"),
        eos        = require("end-of-stream"),
        path       = require("path"),
        File       = require("vinyl");

    options = _.defaults(options || {}, {
        debug: true,
        uglify: false
    });

    new RSVP
        .Promise(function(resolve, reject) {
            glob("./test/unit/**/*.js", function(err, files) {
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
                debug: options.debug
            });

            bundler.add("./build/test/module/polyfills.js");

            bundler.external("vertx");
            bundler.external("jsdom");

            bundler.require("./build/test/module/fs.js", { expose: "fs" });

            file = new File({
                contents: contents
            });

            bundler.add(file);

            stream = bundler
                .bundle()
                .pipe(source("test.js"))
                .pipe(buffer());

            if (options.uglify) {
                stream = stream.pipe(uglify());
            }

            stream = stream
                .pipe(gulp.dest("./test/web"));

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
}

gulp.task("webtest:ci", function(done) {
    webTest({ uglify: true, debug: false }, done);
});

gulp.task("webtest:local", function(done) {
    webTest({ uglify: false, debug: true }, done);
});

gulp.task("mocha", function(done) {
    var istanbul = require('gulp-istanbul'),
        mocha    = require("gulp-mocha");

    gulp.src(["./lib/**/*.js"])
        .pipe(istanbul())
        .pipe(istanbul.hookRequire())
        .on('finish', function () {
            gulp.src(["./test/unit/**/*.js", "./test/functional/*.js"])
                .pipe(mocha())
                .pipe(istanbul.writeReports({
                    reporters: ["lcovonly", "text-summary", "html"]
                }))
                .on('end', done);
        });
});

gulp.task("coveralls", function() {
    var coveralls = require('gulp-coveralls');

    return gulp.src('./coverage/lcov.info')
        .pipe(coveralls());
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

gulp.task("karma:sauce", function(done) {
    var karma = require('karma').server;

    done = _.once(done);

    karma.start({
        configFile: __dirname + '/.karma.js'
    }, function(err) {
        // leave error
        done();
    });
});

gulp.task("karma:local", function(done) {
    var karma = require('karma').server;

    karma.start({
        configFile: __dirname + '/.karma.local.js'
    }, done);
});

gulp.task("jsdoc", function() {
    var jsdoc2md = require("gulp-jsdoc-to-markdown"),
        rename   = require("gulp-rename"),
        concat   = require("gulp-concat");

    return gulp.src("./lib/**/*.js")
        .pipe(concat("all.js"))
        .pipe(jsdoc2md())
        .pipe(rename(function(path){
            path.extname = ".md";
        }))
        .pipe(gulp.dest("./docs"));
});








gulp.task("test", function(done) {
    var runSequence = require("run-sequence");

    runSequence(
        "clean",
        "lint",
        "style",
        "mocha",
        "webtest:local",
        "karma:local",
        done
    );
});

gulp.task("ci", function(done) {
    var runSequence = require("run-sequence");

    runSequence(
        "clean",
        "lint",
        "style",
        "mocha",
        "coveralls",
        "webtest:ci",
        "karma:sauce",
        done
    );
});