var Loader    = require("../loader"),
    Async     = require("../async"),
    _         = require("../utils"),
    pathUtils = require("path"),
    CJSLoader;

/**
 * CJSLoader
 *
 * @class
 * @extends Loader
 */
CJSLoader = Loader.extend(
    /**
     * @lends CJSLoader.prototype
     */
    {
        require: function(path, async) {
            var self = this;

            _.assert(async instanceof Async, "Async is expected");

            return async.promise(function(resolve, reject) {
                try {
                    resolve(self.adaptee.call(null, self._normalizePath(path)));
                } catch (err) {
                    reject(err);
                }
            });
        },

        read: function(path, async) {
            var self = this,
                fs;

            if (!this.options.browser && (fs = require("fs")) && fs.readFile) {
                return async.promise(function(resolve, reject) {
                    fs.readFile(self._normalizePath(path), function(err, src) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(src);
                        }
                    });
                });
            } else {
                return this.require(path, async);
            }
        },

        _normalizePath: function(path) {
            var base;

            if ((base = this.options.base)) {
                // normalize path
                if (path.charAt(0) === "/") {
                    path = path.slice(1);
                }

                return pathUtils.resolve(base, path);
            }

            return path;
        }
    },
    /**
     * @lends CJSLoader
     */
    {
        DEFAULTS: {
            browser: false,
            base:    null
        }
    }
);

module.exports = CJSLoader;