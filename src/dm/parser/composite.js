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
        constructor: function() {
            Parser.prototype.constructor.apply(this, arguments);
            this.parsers = [];
        },

        add: function(parser, prepend) {
            if (!(parser instanceof Parser)) {
                throw new TypeError("Parser is expected");
            }

            if (prepend) {
                this.parsers.unshift(parser);
            } else {
                this.parsers.push(parser);
            }

            return this;
        },

        test: function(str) {
            var self = this;

            return this.async.promise(function(resolve, reject) {
                _.async.find(
                    self.parsers,
                    function(parser, index, next) {
                        parser
                            .test(str)
                            .then(function(acceptable) {
                                next(null, acceptable);
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

        parse: function(str) {
            var self = this;

            return this.async.promise(function(resolve, reject) {
                _.async.findSeries(
                    self.parsers,
                    function(parser, index, next) {
                        parser
                            .test(str)
                            .then(function(isAcceptable) {
                                if (isAcceptable) {
                                    parser.parse(str)
                                        .then(function(parsed) {
                                            next(parsed);
                                        });
                                } else {
                                    next();
                                }
                            });
                    },
                    function(err, parsed) {
                        if (err) {
                            reject(err);
                            return;
                        }

                        resolve(parsed || str);
                    }
                );
            });
        }
    }
);

module.exports = CompositeParser;