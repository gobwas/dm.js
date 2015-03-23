var Template = require("../template"),
    _        = require("../../../utils"),
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
         * Template for checking reference to the service.
         *
         * Could be applied to string in format:
         * @<service>[:<method>[\[<argument-1>,[<argument-n>]\]]]
         *
         * @type {RegExp}
         * @private
         * @static
         */
        REGEXP: /^@([a-zA-Z_$][0-9a-zA-Z_$\.\-]*)(?::([^\[\]]+)(\[.*\])?)?$/i
    }
);

module.exports = ServiceTemplate;