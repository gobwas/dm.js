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
                args:     JSON.parse(match[3])
            }
        }
    },
    {
        /**
         * Template for checking reference to the service.
         *
         * Could be applied to string in format:
         * @<service>[:<method>[\[<argument-1>,[<argument-n>]\]]]
         *
         * @type {RegExp}
         * @private
         * @static
         */
        REGEXP: /^@([^:]+)(?::([^\[\]]+)(\[.*\])?)?$/i
    }
);

module.exports = ServiceTemplate;