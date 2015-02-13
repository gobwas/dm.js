var Parser = require("../parser"),
    _      = require("../utils"),
    WrappingParser;

/**
 * WrappingParser
 *
 * @class
 * @extends Parser
 */
WrappingParser = Parser.extend(
    /**
     * @lends WrappingParser.prototype
     */
    {
        constructor: function(async, parser, options) {
            _.assert(parser instanceof Parser, "Parser is expected", TypeError);

            Parser.prototype.constructor.call(this, async, options);

            this.parser = parser;
        },

        test: function(str) {
            return this.parser.test(str);
        }
    }
);

module.exports = WrappingParser;