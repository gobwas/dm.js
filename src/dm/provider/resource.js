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
         * @param {object} definition
         * @param {string} definition.path
         * @param {string} definition.handler
         */
        get: function(definition) {
            throw new Error("Method 'get' must be implemented");
        }
    }
);

module.exports = ResourceProvider;