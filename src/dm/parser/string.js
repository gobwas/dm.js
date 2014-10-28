var Parser = require("../parser"),
    _      = require("../utils"),
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
        constructor: function() {
            Parser.prototype.constructor.apply(this, arguments);

            this.cache = {
                once:     {},
                multiple: {}
            };
        },

        test: function(str) {
            return !!this._execOnce(str);
        },

        _execOnce: function(str) {
            var cached;

            if (!(cached = this.cache.once[str])) {
                cached = this.cache.once[str] = this.constructor.REGEXP.exec(str);
                this.constructor.REGEXP.lastIndex = 0;
            }

            return cached;
        },

        _execMultiple: function(str) {
            var cached, match;

            if (!(cached = this.cache.multiple[str])) {
                cached = [];

                while (match = this.constructor.REGEXP.exec(str)) {
                    cached.push(match);
                }

                this.constructor.REGEXP.lastIndex = 0;

                this.cache.multiple[str] = cached;
            }

            return cached;
        }
    }
);

module.exports = StringParser;