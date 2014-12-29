var StringParser = require("../string"),
    _            = require("../../utils"),
    PropertyStringParser;

/**
 * PropertyStringParser
 *
 * @class
 * @extends StringParser
 */
PropertyStringParser = StringParser.extend(
    /**
     * @lends PropertyStringParser.prototype
     */
    {
        parse: function(str) {
            var match;

            match = this._execOnce(str);

            return this.provider.get(match[2], match[1]);
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

module.exports = PropertyStringParser;