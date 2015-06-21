var SlugTemplate = require("../slug"),
    _            = require("../../../../utils"),
    LiveSlugTemplate;

/**
 * LiveSlugTemplate
 *
 * @class LiveSlugTemplate
 * @extends SlugTemplate
 * @author Sergey Kamardin <s.kamardin@tcsbank.ru>
 */
LiveSlugTemplate = SlugTemplate.extend(
    /**
     * @lends LiveSlugTemplate.prototype
     */
    {
        // empty
    },
    {
        /**
         * SlugTemplate for checking reference to property in string context.
         *
         * @type {RegExp}
         * @private
         * @static
         */
        REGEXP: /\$\{(\d+)\}/gi
    }
);

module.exports = LiveSlugTemplate;