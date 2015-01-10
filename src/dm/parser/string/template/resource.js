var Template = require("../template"),
    _      = require("lodash"),
    ResourceTemplate;

/**
 * ResourceTemplate
 *
 * @class ResourceTemplate
 * @extends Template
 * @author Sergey Kamardin <s.kamardin@tcsbank.ru>
 */
ResourceTemplate = Template.extend(
    /**
     * @lends ResourceTemplate.prototype
     */
    {
        define: function(match) {
            return {
                handler: match[1],
                path:    match[2]
            };
        }
    },
    {
        /**
         * Template for checking reference to the resource.
         *
         * @type {RegExp}
         * @private
         * @static
         */
        REGEXP: /^#(?:([^!]+)!)?(.*)#$/i
    }
);

module.exports = ResourceTemplate;