var Template = require("../template"),
    _        = require("../../../utils"),
    JSONPointerTemplate;

/**
 * JSONPointerTemplate
 *
 * @class
 * @extends Template
 */
JSONPointerTemplate = Template.extend(
    /**
     * @lends HypnofrogTemplate.prototype
     */
    {
        define: function(match) {
            return {
                path: match[1]
            };
        }
    },

    {
        /**
         * Template for checking any path.
         *
         * @type {RegExp}
         * @private
         * @static
         */
        REGEXP: /^(.+)$/i
    }
);

module.exports = JSONPointerTemplate;