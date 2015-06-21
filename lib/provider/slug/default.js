var SlugProvider = require("../slug"),
    _            = require("../../utils"),
    DefaultSlugProvider;

/**
 * DefaultSlugProvider
 *
 * @class DefaultSlugProvider
 * @extends SlugProvider
 * @author Sergey Kamardin <s.kamardin@tcsbank.ru>
 */
DefaultSlugProvider = SlugProvider.extend(
    /**
     * @lends DefaultSlugProvider.prototype
     */
    {
        /**
         * Returns service promise.
         *
         * @param {Object} definition
         * @param {number} definition.index
         *
         * @returns {Promise}
         */
        get: function(definition) {
            var self = this,
                index;

            _.assert(_.isObject(definition), "Object is expected", TypeError);

            index = definition.index;

            _.assert(_.isNumber(index), "Definition.index is expected to be a number", TypeError);

            return this.async.resolve(this.slugs[index]);
        }
    }
);

module.exports = DefaultSlugProvider;