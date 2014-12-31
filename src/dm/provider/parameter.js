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
         * @param {object} definition
         * @param {string} definition.name
         */
        get: function(definition) {
            throw new Error("Method 'get' must be implemented");
        }
    }
);

module.exports = ParameterProvider;