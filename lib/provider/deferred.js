var Provider = require("../provider"),
    _      = require("../utils"),
    DeferredProvider, undef;

undef = {};

/**
 * DeferredProvider
 *
 * @class
 * @extends Provider
 */
DeferredProvider = Provider.extend(
    /**
     * @lends DeferredProvider.prototype
     */
    {
        constructor: function(dm, async, options, inner) {
            Provider.prototype.constructor.call(this, dm, async, options);
            _.assert(inner instanceof Provider, "Provider is expected", TypeError);
            this.inner = inner;
        },

        get: function() {
            var cache, inner, async, args;

            cache = undef;
            inner = this.inner;
            async = this.async;
            args  = arguments;

            return this.async.resolve(
                function() {
                    if (cache === undef) {
                        cache = async.promise(function(resolve, reject) {
                            try {
                                resolve(inner.get.apply(inner, args));
                            } catch (err) {
                                reject(err);
                            }
                        });
                    }

                    return cache;
                }
            );
        }
    }
);

module.exports = DeferredProvider;