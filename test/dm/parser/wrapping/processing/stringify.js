var _              = require('lodash'),
    sinon          = require('sinon'),
    chai           = require('chai'),
    Async          = require('../../../../../src/dm/async'),
    Chance         = require("chance"),
    RSVP           = require("rsvp"),
    Parser         = require("../../../../../src/dm/parser"),
    StringifyProcessingParser = require('../../../../../src/dm/parser/wrapping/processing/stringify'),
    assert, expect;

assert = chai.assert;
expect = chai.expect;
chance = new Chance;

describe("StringifyProcessingParser", function() {
    var parser, async, targetParser;

    beforeEach(function() {
        // create instanceof Async
        async = Object.create(Async.prototype);

        // create instance of Template
        targetParser = Object.create(Parser.prototype);

        parser = new StringifyProcessingParser(async, targetParser);
    });

    describe("#process", function() {

        it("should work correct when matches repeats results", function() {
            var results, str, exp, glue, pos, word;

            glue = "<" + chance.word() + ">";

            pos = 0;
            word = chance.word();

            results = [];
            _.times(2, function() {
                results.push({
                    match: {
                        string: word,
                        position: [pos, pos + word.length - 1]
                    },
                    result: word + "-" + chance.city()
                });

                pos+= word.length + glue.length;
            });

            str = _.map(results, function(obj) {
                return obj.match.string;
            }).join(glue);

            exp = _.map(results, function(obj) {
                return obj.result;
            }).join(glue);

            sinon.stub(targetParser, "parse", function() {
                return RSVP.Promise.resolve(results);
            });

            expect(parser.process(str, results)).equal(exp);
        });

        it("should stringify results properly", function() {
            var results, str, exp, glue, pos;

            glue = "<" + chance.word() + ">";

            pos = 0;
            results = _.map(new Array(5), function(v, index) {
                var word, match;

                word = chance.word();
                match = {
                    string:   word,
                    position: [pos, pos + word.length - 1]
                };

                pos+= word.length + glue.length;

                switch (index) {
                    case 0: {

                        return {
                            match: match,
                            result: {
                                toString: (function() {
                                    var word;

                                    word = chance.word();

                                    return function() {
                                        return word;
                                    }
                                })()
                            }
                        };
                    }

                    default: {
                        return {
                            match: match,
                            result: chance.word()
                        };
                    }
                }
            });

            str = _.map(results, function(obj) {
                return obj.match.string;
            }).join(glue);

            exp = _.map(results, function(obj) {
                return obj.result;
            }).join(glue);

            sinon.stub(targetParser, "parse", function() {
                return RSVP.Promise.resolve(results);
            });

            expect(parser.process(str, results)).equal(exp);
        });

    });

});



