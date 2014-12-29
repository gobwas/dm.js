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
            var match;

            match = this._execOnce(str);

            return this.provider.get(match[1]);
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