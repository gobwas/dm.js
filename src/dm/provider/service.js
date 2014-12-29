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
         * @param {string} name
         * @param {string} property
         * @param {Array}  args
         */
        get: function(name, property, args) {
            throw new Error("Method 'get' must be implemented");
        }
    }
);

module.exports = ServiceProvider;