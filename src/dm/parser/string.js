var Parser   = require("../parser"),
    _        = require("../utils"),
    Template = require("./string/template"),
    Provider = require("../provider"),
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
        constructor: function(async, template, provider, options) {
            Parser.prototype.constructor.call(this, async, options);

            _.assert(template instanceof Template, "Template is expected", TypeError);
            _.assert(provider instanceof Provider, "Provider is expected", TypeError);

            this.provider = provider;
            this.template = template;
        },

        test: function(str) {
            return !!this.template.test(str);
        }
    }
);

module.exports = StringParser;