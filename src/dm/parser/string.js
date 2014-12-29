var Parser   = require("../parser"),
    _        = require("../utils"),
    Template = require("./str/template"),
    Builder  = require("./str/builder"),
    StringParser;

/**
 * StringParser
 *
 * @class
 * @extends Parser
 */
StringParser = Parser.extend(
    /**
     * @lends StringParser.prototype
     */
    {
        constructor: function(async, template, builder, options) {
            Parser.prototype.constructor.call(this, async, options);

            _.assert(template instanceof Template, "Template is expected", TypeError);
            _.assert(builder instanceof Builder, "Builder is expected", TypeError);

            this.provider = template;
            this.builder = builder;
        },

        test: function(str) {
            return !!this.template.test(str);
        }
    }
);

module.exports = StringParser;