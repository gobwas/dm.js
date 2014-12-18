var EventualParser = require("../../../src/dm/parser/eventual"),
    Parser         = require("../../../src/dm/parser"),
    Async          = require("../../../src/dm/async"),
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

    describe("#constructor", function() {

        it("should throw error when constructing without parser", function() {
            function builder() {
                new EventualParser(async);
            }

            expect(builder).to.throw(TypeError, "Parser is expected");
        });

    });

    describe("#test", function() {

        it("should call target parser's #test method", function() {
            var word, testStub, testResult;

            testResult = chance.bool();

            word = chance.word();

            testStub = sinon.stub(targetParser, "test", function(word) {
                return testResult;
            });

            expect(parser.test(word)).equal(testResult);

            expect(testStub.callCount).equal(1);
            expect(testStub.calledOn(targetParser)).to.be.true();
            expect(testStub.calledWithExactly(word)).to.be.true();
        });

    });

    describe("#parse", function() {

        it("should eventually parse given string", function(done) {
            var testStub, parseStub, transitionsCount, transitional;

            testStub = sinon.stub(targetParser, "test").onCall(0).returns(true);
            parseStub = sinon.stub(targetParser, "parse").onCall(0).returns("hello");

            // create transitional results
            transitionsCount = 10;
            transitional = _.map(new Array(transitionsCount), function() {
                return chance.word();
            });

            // on each result we say - "Yes, I can parse it"
            // and then return on #parse corresponding to index value
            _.forEach(transitional, function(result, index) {
                testStub.onCall(index).returns(true);
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

    });

});