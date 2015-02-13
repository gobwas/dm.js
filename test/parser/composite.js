var CompositeParser = require("../../lib/parser/composite"),
    Parser          = require("../../lib/parser"),
    Async           = require("../../lib/async"),
    Chance          = require("chance"),
    _               = require("lodash"),
    sinon           = require("sinon"),
    RSVP            = require("rsvp"),
    chai            = require("chai"),
    chance, expect, assert;

chance = new Chance;
assert = chai.assert;
expect = chai.expect;

describe("CompositeParser", function() {
    var parser, async;

    beforeEach(function() {
        async = Object.create(Async.prototype);

        sinon.stub(async, "promise", function(cb) {
            return new RSVP.Promise(cb);
        });
        sinon.stub(async, "resolve", function(v) {
            return RSVP.Promise.resolve(v);
        });

        parser = new CompositeParser(async);
    });

    describe("#test", function() {

        it("Should call #test with string on every child parallel", function(done) {
            var word, children, verify;

            word = chance.word();

            children = _.chain(new Array(5))
                .map(function() {
                    var child, mock;

                    child = Object.create(Parser.prototype);

                    mock = sinon.mock(child);
                    mock.expects("test")
                        .once()
                        .withExactArgs(word)
                        .on(child);

                    mock.expects("parse")
                        .never();

                    parser.add(child);

                    return mock.verify.bind(mock);
                })
                .value();

            verify = _.compose.apply(_, children);

            parser.test(word)
                .then(function() {
                    verify();
                    done();
                })
                .catch(done);
        });

        it("Should return boolean accordingly to the test results from children", function(done) {
            var parsersCount, word, result;

            parsersCount = 5;
            word         = chance.word();
            result       = chance.bool();

            _.chain(new Array(parsersCount))
                .forEach(function(value, index) {
                    var child;

                    // create the instanceof Parser
                    child = Object.create(Parser.prototype);

                    sinon.stub(child, "test", function(word) {
                        var test;

                        // only last child will return `true`
                        test = index == parsersCount - 1;

                        return async.resolve(test ? result : false);
                    });

                    parser.add(child);
                })
                .value();

            parser.test(word)
                .then(function(isAcceptable) {
                    expect(isAcceptable).to.be.a("boolean").and.equal(result);
                    done();
                })
                .catch(done);
        })

    });

    describe("#parse", function() {

        it("Should call #parse after #test completed with truly value", function(done) {
            var children, parsersCount, acceptIndex, word, result, verify;

            parsersCount = 10;
            acceptIndex  = 5;
            word         = chance.word();
            result       = chance.word();

            children = _.chain(new Array(parsersCount))
                .map(function(value, index) {
                    var doAccept, isBefore, child,
                        testStub, parseStub;

                    // only last but one child will accept string
                    doAccept = index == acceptIndex;
                    isBefore = index <= acceptIndex;

                    child = Object.create(Parser.prototype);

                    testStub = sinon.stub(child, "test", function(word) {
                        return async.resolve(doAccept);
                    });

                    parseStub = sinon.stub(child, "parse", function(word) {
                        return result;
                    });

                    parser.add(child);

                    return function() {
                        expect(testStub.callCount).equal(isBefore ? 1 : 0);
                        expect(parseStub.callCount).equal(doAccept ? 1 : 0);

                        if (isBefore) {
                            expect(testStub.calledWith(word)).to.be.true();
                        }

                        if (doAccept) {
                            expect(parseStub.calledWith(word)).to.be.true();
                        }
                    }
                })
                .value();

            verify = _.compose.apply(_, children);

            parser.parse(word)
                .then(function(parsed) {
                    verify();

                    expect(parsed).equal(result);

                    done();
                })
                .catch(done);
        });

    });

});