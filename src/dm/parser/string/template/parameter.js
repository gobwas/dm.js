var TemplateStringParser = require("../template"),
    _                    = require("../../../utils"),
    ParameterTemplateStringParser;

/**
 * ParameterTemplateStringParser
 *
 * @class
 * @extends TemplateStringParser
 */
ParameterTemplateStringParser = TemplateStringParser.extend(
    /**
     * @lends ParameterTemplateStringParser.prototype
     */
    {
        _make: function(match) {
            return this.provider.make({
                name: match[1]
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
        REGEXP: /%\{([^%]+?)\}/gi
    }
);

module.exports = ParameterTemplateStringParser;