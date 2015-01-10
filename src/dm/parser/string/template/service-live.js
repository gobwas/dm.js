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
            var name, property, args;

            name = match[1];
            property = match[2];

            if ((args = match[3])) {
                try {
                    args = JSON.parse(args);
                } catch (err) {
                    throw new Error("Could not parse arguments for service '" + name + "'");
                }
            }

            return {
                name:     name,
                property: property,
                args:     args
            };
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