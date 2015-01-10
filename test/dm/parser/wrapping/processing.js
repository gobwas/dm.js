var ProcessingParser = require("../../../../src/dm/parser/wrapping/processing"),
    Parser         = require("../../../../src/dm/parser"),
    Async          = require("../../../../src/dm/async"),
    Chance         = require("chance"),
    _              = require("lodash"),
    sinon          = require("sinon"),
    RSVP           = require("rsvp"),
    chai           = require("chai"),
    chance, expect, assert;

chance = new Chance;
assert = chai.assert;
expect = chai.expect;


describe("ProcessingParser", function() {
    var async, parser, targetParser;

    beforeEach(function() {
        async = Object.create(Async.prototype);
        targetParser = Object.create(Parser.prototype);

        parser = new ProcessingParser(async, targetParser);
    });

    describe("#parse", function() {

        it("should call #process method with handled result", function(done) {
            var str, result, final,
                processStub;

            str = chance.word();

            sinon.stub(targetParser, "parse", function() {
                return RSVP.Promise.resolve(result = chance.word());
            });

            processStub = sinon.stub(parser, "process", function() {
                return (final = chance.word());
            });

            parser.parse(str)
                .then(function(response) {
                    expect(response).equal(final);
                    expect(processStub.callCount).equal(1);
                    expect(processStub.firstCall.calledWithExactly(str, result)).to.be.true();
                    expect(processStub.firstCall.calledOn(parser)).to.be.true();
                })
                .then(done, done);
        });

    });

});