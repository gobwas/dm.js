var Parser = require("../wrapping"),
    _      = require("../../utils"),
    ProcessingParser;

/**
 * ProcessingParser
 *
 * @class
 * @extends Parser
 */
ProcessingParser = Parser.extend(
    /**
     * @lends ProcessingParser.prototype
     */
    {
        parse: function(some) {
            var self = this;

            return this.parser
                .parse(some)
                .then(function(results) {
                    return self.process(some, results);
                });
        },

        /**
         * @abstract
         */
        process: function(some, results) {
            throw new Error("Method 'process' must be implemented");
        }
    }
);

module.exports = ProcessingParser;