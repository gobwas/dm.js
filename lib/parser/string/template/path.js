var Template = require("../template"),
    _        = require("../../../utils"),
    PathTemplate;

/**
 * PathTemplate
 *
 * @class
 * @extends Template
 */
PathTemplate = Template.extend(
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

module.exports = PathTemplate;