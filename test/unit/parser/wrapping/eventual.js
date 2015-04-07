var EventualParser = require("../../../../lib/parser/wrapping/eventual"),
    Parser         = require("../../../../lib/parser"),
    Async          = require("../../../../lib/async"),
    Chance         = require("chance"),
    _              = require("lodash"),
    sinon          = require("sinon"),
    RSVP           = require("rsvp"),
    chai           = require("chai"),
    chance, expect, assert;

chance = new Chance;
assert = chai.assert;
expect = chai.expect;


describe("EventualParser", function() {
    var async, parser, targetParser;

    beforeEach(function() {
        async = Object.create(Async.prototype);

        sinon.stub(async, "promise", function(cb) { return new RSVP.Promise(cb); });
        sinon.stub(async, "resolve", function(val) {
            return RSVP.Promise.resolve(val);
        });

        targetParser = Object.create(Parser.prototype);

        parser = new EventualParser(async, targetParser);
    });

    describe("#parse", function() {

        it("should eventually parse given string", function(done) {
            var testStub, parseStub, transitionsCount, transitional;

            testStub = sinon.stub(targetParser, "test").returns(true);
            parseStub = sinon.stub(targetParser, "parse").onCall(0).returns("hello");

            // create transitional results
            transitionsCount = 10;
            transitional = _.map(new Array(transitionsCount), function() {
                return chance.word();
            });

            // on each result we say - "Yes, I can parse it"
            // and then return on #parse corresponding to index value
            _.forEach(transitional, function(result, index) {
                parseStub.onCall(index).returns(result);
            });

            // the last time we say - "No, I cant parse this"
            testStub.onCall(transitionsCount).returns(false);

            // run
            parser.parse(chance.word())
                .then(function(result) {
                    // parser should return the last parsed string
                    expect(result).equal(transitional[transitionsCount - 1]);
                    done();
                })
                .catch(done);
        });

        it("should stop when parser could not parse", function(done) {
            var testStub, parseStub, transitionsCount, errorIndex, transitional;

            testStub = sinon.stub(targetParser, "test").returns(true);
            parseStub = sinon.stub(targetParser, "parse").onCall(0).returns("hello");

            // create transitional results
            transitionsCount = 10;
            errorIndex = 5;
            transitional = _.map(new Array(transitionsCount), function(v, index) {
                var result;

                result = chance.word();
                parseStub.onCall(index).returns(index == errorIndex ? RSVP.Promise.reject(new SyntaxError()) : result);

                return result;
            });

            // the last time we say - "No, I cant parse this"
            testStub.onCall(transitionsCount).returns(false);

            // run
            parser.parse(chance.word())
                .then(function(result) {
                    // parser should return the last parsed string
                    expect(result).equal(transitional[errorIndex - 1]);
                    done();
                })
                .catch(done);
        });

    });

});