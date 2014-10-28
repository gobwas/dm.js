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
            var args, attributes;

            args = this._execOnce(str);

            attributes = {
                name:     args[1],
                property: args[2],
                args:     args[3]
            };

            return this.provider.make(attributes);
        }
    },
    {
        /**
         * Template for checking reference to service.
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