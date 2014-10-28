var StringParser = require("../string"),
    ParameterStringParser;

/**
 * ParameterStringParser
 *
 * @class
 * @extends StringParser
 */
ParameterStringParser = StringParser.extend(
    /**
     * @lends ParameterStringParser.prototype
     */
    {
        parse: function(str) {
            var args, attributes;

            args = this._execOnce(str);

            attributes = {
                name: args[1]
            };

            return this.provider.make(attributes);
        }
    },
    {
        /**
         * Template for checking reference to Parameter.
         *
         * @type {RegExp}
         * @private
         * @static
         */
        REGEXP: /^%(.*)%$/i
    }
);

module.exports = ParameterStringParser;