var StringParser = require("../string"),
    _            = require("../../utils"),
    ServiceStringParser;

/**
 * ServiceStringParser
 *
 * @class
 * @extends StringParser
 */
ServiceStringParser = StringParser.extend(
    /**
     * @lends ServiceStringParser.prototype
     */
    {
        parse: function(str) {
            var match;

            match = this._execOnce(str);

            return this.provider.get(match[1], match[2], match[3]);
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
        REGEXP: /^@([^:]+)(?::([^\[\]]+)(\[.*\])?)?$/i
    }
);

module.exports = ServiceStringParser;