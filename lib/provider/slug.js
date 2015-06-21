var Provider = require("../provider"),
    _        = require("../utils"),
    SlugProvider;

/**
 * SlugProvider
 *
 * @class
 * @extends Provider
 */
SlugProvider = Provider.extend(
    /**
     * @lends SlugProvider.prototype
     */
    {
        constructor: function(dm, async, options, slugs) {
            Provider.prototype.constructor.call(this, dm, async, options);
            this.slugs = slugs;
        },

        /**
         * @abstract
         * @param {object} definition
         * @param {number} definition.index
         */
        get: function(definition) {
            throw new Error("Method 'get' must be implemented");
        }
    }
);

module.exports = SlugProvider;