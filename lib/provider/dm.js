var Provider = require("../provider"),
    _        = require("../utils"),
    DMProvider;

/**
 * DMProvider
 *
 * @class
 * @extends Provider
 */
DMProvider = Provider.extend(
    /**
     * @lends DMProvider.prototype
     */
    {
        /**
         * @abstract
         * @param {object} definition
         */
        get: function(definition) {
            throw new Error("Method 'get' must be implemented");
        }
    }
);

module.exports = DMProvider;