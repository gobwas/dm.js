var Template = require("../template"),
    _        = require("lodash"),
    ParameterLiveTemplate;

/**
 * ParameterLiveTemplate
 *
 * @class ParameterLiveTemplate
 * @extends Template
 * @author Sergey Kamardin <s.kamardin@tcsbank.ru>
 */
ParameterLiveTemplate = Template.extend(
    /**
     * @lends ParameterLiveTemplate.prototype
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
         * Template for checking reference to property in string context.
         *
         * @type {RegExp}
         * @private
         * @static
         */
        REGEXP: /%\{([^%]+?)\}/gi
    }
);

module.exports = ParameterLiveTemplate;