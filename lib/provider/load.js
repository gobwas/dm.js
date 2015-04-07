var Provider = require("../provider"),
    Async    = require("../async"),
    Loader   = require("../loader"),
    _        = require("../utils"),
    LoadProvider;

/**
 * LoadProvider
 *
 * @class
 * @extends Provider
 */
LoadProvider = Provider.extend(
    /**
     * @lends LoadProvider.prototype
     */
    {
        constructor: function(loader, async, options) {
            _.assert(async instanceof Async, "Async is expected",  TypeError);
            _.assert(loader instanceof Loader, "Loader is expected",  TypeError);

            this.async = async;
            this.loader = loader;
            this.options = _.extend({}, this.constructor.DEFAULTS, options || {});
        },

        /**
         * @abstract
         * @param {Object} definition
         * @param {string} definition.path
         */
        get: function(definition) {
            throw new Error("Method 'get' must be implemented");
        }
    }
);

module.exports = LoadProvider;