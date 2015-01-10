var Parser = require("../parser"),
    _      = require("../utils"),
    CompositeParser;

/**
 * CompositeParser
 *
 * @class
 * @extends Parser
 */
CompositeParser = Parser.extend(
    /**
     * @lends CompositeParser.prototype
     */
    {
        constructor: function(async, options) {
            Parser.prototype.constructor.call(this, async, options);
            this.parsers = [];
        },

        add: function(parser, prepend) {
            _.assert(parser instanceof Parser, "Parser is expected", TypeError);

            if (prepend) {
                this.parsers.unshift(parser);
            } else {
                this.parsers.push(parser);
            }

            return this;
        },

        test: function(some) {
            var self = this;

            return this.async.promise(function(resolve, reject) {
                // here we find in parallel
                // cause we not interested in index of the parser
                // we want just know that someone can parse it
                _.async.find(
                    self.parsers,
                    function(parser, index, next) {
                        self.async
                            .resolve(parser.test(some))
                            .then(function(isAcceptable) {
                                next(null, isAcceptable);
                            })
                            .catch(next);
                    },
                    function(err, accepter) {
                        if (err) {
                            reject(err);
                            return;
                        }

                        resolve(!!accepter);
                    }
                );
            });
        },

        parse: function(some) {
            var self = this;

            return this.async
                .promise(function(resolve, reject) {
                    // parse in series, cause it can be logically important
                    _.async.findSeries(
                        self.parsers,
                        function(parser, index, next) {
                            self.async
                                .resolve(parser.test(some))
                                .then(function(isAcceptable) {
                                    next(null, isAcceptable);
                                });
                        },
                        function(err, accepter) {
                            if (err) {
                                reject(err);
                                return;
                            }

                            resolve(accepter);
                        }
                    );
                })
                .then(function(parser) {
                    if (parser) {
                        return self.async.resolve(parser.parse(some));
                    }
                });
        }
    }
);

module.exports = CompositeParser;