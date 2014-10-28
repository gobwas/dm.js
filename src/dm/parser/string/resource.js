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
            var args, attributes;

            args = this._execOnce(str);

            attributes = {
                path:    args[2],
                handler: args[1]
            };

            return this.provider.make(attributes);
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