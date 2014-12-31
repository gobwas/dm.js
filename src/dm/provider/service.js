var Provider = require("../provider"),
    _        = require("../utils"),
    ServiceProvider;

/**
 * ServiceProvider
 *
 * @class
 * @extends Provider
 */
ServiceProvider = Provider.extend(
    /**
     * @lends ServiceProvider.prototype
     */
    {
        /**
         * @abstract
         * @param {object} definition
         * @param {string} definition.name
         * @param {string} definition.property
         * @param {Array}  definition.args
         */
        get: function(definition) {
            throw new Error("Method 'get' must be implemented");
        }
    }
);

module.exports = ServiceProvider;