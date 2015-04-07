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
                        var test;

                        try {
                            test = parser.test(initial);
                        } catch (err) {
                            next(err);
                            return;
                        }

                        self.async
                            .resolve(test)
                            .then(function(acceptable) {
                                var parsed;

                                if (!acceptable) {
                                    next(null, initial, initial);
                                    return;
                                }

                                try {
                                    parsed = parser.parse(initial);
                                } catch (err) {
                                    next(err);
                                    return;
                                }

                                self.async
                                    .resolve(parsed)
                                    .then(function(parsed) {
                                        next(null, parsed, initial);
                                    })
                                    .catch(function(err) {
                                        // hm
                                        if (err instanceof SyntaxError) {
                                            next(null, initial, initial);
                                            return;
                                        }

                                        next(err);
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