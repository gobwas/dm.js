var Template = require("../template"),
    _        = require("lodash"),
    ParameterTemplate;

/**
 * ParameterTemplate
 *
 * @class ParameterTemplate
 * @extends Template
 * @author Sergey Kamardin <s.kamardin@tcsbank.ru>
 */
ParameterTemplate = Template.extend(
    /**
     * @lends ParameterTemplate.prototype
     */
    {
        define: function(match) {
            return {
                name: match[1]
            }
        }
    },
    {
        /**
         * Template for checking reference to Parameter.
         *
         * @type {RegExp}
         * @private
         * @static
         */
        REGEXP: /^%(.*)%$/i
    }
);

module.exports = ParameterTemplate;