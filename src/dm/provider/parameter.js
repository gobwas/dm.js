var Provider = require("../provider"),
    _        = require("../utils"),
    ParameterProvider;

/**
 * ParameterProvider
 *
 * @class
 * @extends Provider
 */
ParameterProvider = Provider.extend(
    /**
     * @lends ParameterProvider.prototype
     */
    {
        /**
         * @abstract
         * @param {string} name
         */
        get: function(name) {
            throw new Error("Method 'get' must be implemented");
        }
    }
);

module.exports = ParameterProvider;