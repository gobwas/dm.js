var Template = require("../template"),
    _      = require("lodash"),
    ServiceTemplate;

/**
 * ServiceTemplate
 *
 * @class ServiceTemplate
 * @extends Template
 * @author Sergey Kamardin <s.kamardin@tcsbank.ru>
 */
ServiceTemplate = Template.extend(
    /**
     * @lends ServiceTemplate.prototype
     */
    {
        define: function(match) {
            return {
                name:     match[1],
                property: match[2],
                args:     match[3]
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
        REGEXP: /@\{([^:]+)(?::([^\[\]]+)(\[.*\])?)?\}/gi
    }
);

module.exports = ServiceTemplate;