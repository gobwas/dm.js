var Loader = require("../loader"),
    Async  = require("../async"),
    _      = require("../utils"),
    RequireJSLoader;

/**
 * RequireJSLoader
 *
 * @class
 * @extends Loader
 */
RequireJSLoader = Loader.extend(
    /**
     * @lends RequireJSLoader.prototype
     */
    {
        require: function(path, async) {
            var self = this;

            _.assert(async instanceof Async, "Async is expected", TypeError);

            return async.promise(function(resolve, reject) {
                self.adaptee([path], resolve, reject);
            });
        },

        read: function(path, async, options) {
            var self = this;

            _.assert(async instanceof Async, "Async is expected");

            options = options || {};

            return async.promise(function(resolve, reject) {
                self.adaptee([[options.handler || "text", path].join('!')], resolve, reject);
            });
        }
    }
);

module.exports = RequireJSLoader;