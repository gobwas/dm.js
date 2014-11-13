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
        constructor: function() {
            Loader.prototype.constructor.apply(this, arguments);
            this.requirejs = this.adaptee;
        },

        require: function(path, async) {
            var self = this;

            _.assert(async instanceof Async, "Async is expected");

            return async.promise(function(resolve, reject) {
                self.requirejs([path], resolve, reject);
            });
        },

        read: function(path, async, options) {
            var self = this;

            _.assert(async instanceof Async, "Async is expected");

            options = options || {};

            return async.promise(function(resolve, reject) {
                self.requirejs([[options.handler || "text", path].join('!')], resolve, reject);
            });
        }
    }
);

module.exports = RequireJSLoader;