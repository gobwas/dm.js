var WrappingParser = require("../../lib/parser/wrapping"),
    Parser         = require("../../lib/parser"),
    Async          = require("../../lib/async"),
    Chance         = require("chance"),
    _              = require("lodash"),
    sinon          = require("sinon"),
    RSVP           = require("rsvp"),
    chai           = require("chai"),
    chance, expect, assert;

chance = new Chance;
assert = chai.assert;
expect = chai.expect;


describe("WrappingParser", function() {
    var async, parser, targetParser;

    beforeEach(function() {
        async = Object.create(Async.prototype);
        targetParser = Object.create(Parser.prototype);

        parser = new WrappingParser(async, targetParser);
    });

    describe("#constructor", function() {

        it("should throw error when constructing without parser", function() {
            function builder() {
                new WrappingParser(async);
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

});