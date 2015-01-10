var Parser = require("../wrapping"),
    _      = require("../../utils"),
    EventualParser;

/**
 * EventualParser
 *
 * @class EventualParser
 * @extends Parser
 * @author Sergey Kamardin <s.kamardin@tcsbank.ru>
 */
EventualParser = Parser.extend(
    /**
     * @lends EventualParser.prototype
     */
    {
        parse: function(some) {
            var self = this,
                parser;

            parser = this.parser;

            return this.async.promise(function(resolve, reject) {
                _.async.doWhilst(
                    function(truth, value, initial) {
                        var mustRepeat;

                        // if some parser has returned string
                        // try to parse it again
                        mustRepeat = _.isString(value) && value !== initial;

                        truth(mustRepeat);
                    },
                    function(next, initial) {
                        self.async
                            .resolve(parser.test(initial))
                            .then(function(acceptable) {
                                if (!acceptable) {
                                    next(null, initial, initial);
                                    return;
                                }

                                self.async
                                    .resolve(parser.parse(initial))
                                    .then(function(parsed) {
                                        next(null, parsed, initial);
                                    });
                            });
                    },
                    function(err, value) {
                        if (err) {
                            reject(err);
                            return;
                        }

                        resolve(value);
                    },
                    some
                );
            });
        }
    }
);

module.exports = EventualParser;