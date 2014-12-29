var Provider = require("../provider"),
    _        = require("../utils"),
    ResourceProvider;

/**
 * ResourceProvider
 *
 * @class
 * @extends Provider
 */
ResourceProvider = Provider.extend(
    /**
     * @lends ResourceProvider.prototype
     */
    {
        /**
         * @abstract
         * @param {string} path
         * @param {string} handler
         */
        get: function(path, handler) {
            throw new Error("Method 'get' must be implemented");
        }
    }
);

module.exports = ResourceProvider;