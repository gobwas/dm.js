var TemplateStringParser = require("../template"),
    _                    = require("../../../utils"),
    ServiceTemplateStringParser;

/**
 * ServiceTemplateStringParser
 *
 * @class
 * @extends TemplateStringParser
 */
ServiceTemplateStringParser = TemplateStringParser.extend(
    /**
     * @lends ServiceTemplateStringParser.prototype
     */
    {
        _make: function(match) {
            return this.provider.get({
                name:     match[1],
                property: match[2],
                args:     match[3]
            });
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

module.exports = ServiceTemplateStringParser;