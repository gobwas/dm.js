var Loader = require("../loader"),
    fs     = require("fs"),
    _path  = require("path"),

    CJS;

CJS = Loader.extend({
    require: function(path, options) {
        return this.async.promise(function(resolve, reject) {
            var base, realPath;

            if ((base = options.base)) {
                // normalize path
                if (path.charAt(0) === "/") {
                    path = path.slice(1);
                }

                realPath = _path.resolve(base, path);
            } else {
                realPath = path;
            }

            try {
                resolve(require(realPath));
            } catch (err) {
                reject(err);
            }
        });
    },

    read: function(path, options) {
        var self = this;

        // todo is this hack for client-side loading? (i.e. browserify building)
        // todo maybe need to use browserify features to stub 'fs' module
        return this.require(path, options)
            ['catch'](function() {
                return self.async.promise(function(resolve, reject) {
                    fs.readFile(path, function(err, src) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(src);
                        }
                    });
                });
            });
    }
});

module.exports = CJS;