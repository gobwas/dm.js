var Loader = require("../loader"),
    fs     = require("fs"),
    _path  = require("path"),

    CJS;

CJS = Loader.extend({
    _normalizePath: function(path, options) {
        var base;

        if ((base = options.base)) {
            // normalize path
            if (path.charAt(0) === "/") {
                path = path.slice(1);
            }

            return _path.resolve(base, path);
        }

        return path;
    },

    require: function(path, options) {
        path = this._normalizePath(path, options);

        return this.async.promise(function(resolve, reject) {
            try {
                resolve(require(path));
            } catch (err) {
                reject(err);
            }
        });
    },

    read: function(path, options) {
        path = this._normalizePath(path, options);

        // how it should work at client side with browserify?
        if (fs && fs.readFile) {
            return this.async.promise(function(resolve, reject) {
                fs.readFile(path, function(err, src) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(src);
                    }
                });
            });
        } else {
            // fallback for client side
            return this.require(path, options);
        }
    }
});

module.exports = CJS;