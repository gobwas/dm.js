var TemplateStringParser = require("../template"),
    _                    = require("../../../utils"),
    ResourceTemplateStringParser;

/**
 * ResourceTemplateStringParser
 *
 * @class
 * @extends TemplateStringParser
 */
ResourceTemplateStringParser = TemplateStringParser.extend(
    /**
     * @lends ResourceTemplateStringParser.prototype
     */
    {
        _make: function(match) {
            return this.provider.get({
                path:    match[2],
                handler: match[1]
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
        REGEXP: /^#\{(?:([^!]+)!)?(.*)\}$/gi
    }
);

module.exports = ResourceTemplateStringParser;