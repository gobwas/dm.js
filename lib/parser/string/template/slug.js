var Template = require("../template"),
    _        = require("../../../utils"),
    SlugTemplate;

/**
 * SlugTemplate
 *
 * @class SlugTemplate
 * @extends Template
 * @author Sergey Kamardin <s.kamardin@tcsbank.ru>
 */
SlugTemplate = Template.extend(
    /**
     * @lends SlugTemplate.prototype
     */
    {
        define: function(match) {
            return {
                index: parseInt(match[1])
            };
        }
    },
    {
        /**
         * Template for checking reference to the slug parameter.
         *
         * @type {RegExp}
         * @private
         * @static
         */
        REGEXP: /^\$(\d+)$/i
    }
);

module.exports = SlugTemplate;