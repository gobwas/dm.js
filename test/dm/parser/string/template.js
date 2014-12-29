var _              = require('lodash'),
    sinon          = require('sinon'),
    chai           = require('chai'),
    TemplateParser = require('../../../../src/dm/parser/string/template'),
    Async          = require('../../../../src/dm/async'),
    Provider       = require('../../../../src/dm/provider'),
    Chance         = require("chance"),
    RSVP           = require("rsvp"),
    assert, expect;

assert = chai.assert;
expect = chai.expect;
chance = new Chance;

describe("TemplateParser", function() {
    var parser, async, provider;

    beforeEach(function() {
        // create instanceof Async
        async = Object.create(Async.prototype);
        sinon.stub(async, "promise", function(cb) {
            return new RSVP.Promise(cb);
        });
        sinon.stub(async, "resolve", function(val) {
            return RSVP.Promise.resolve(val);
        });

        // create instanceof Provider
        provider = Object.create(Provider.prototype);

        parser = new TemplateParser(async, provider);
    });

    describe("#parse", function() {

        it("should call #_execMultiple with given string", function(done) {
            var mock, str;

            str = chance.word();

            mock = sinon.mock(parser);
            mock.expects("_execMultiple")
                .once()
                .withExactArgs(str)
                .on(parser)
                .returns([]);

            parser.parse(str)
                .then(function() {
                    mock.verify();
                })
                .then(done, done);
        });

        it("should call #_make with every match", function(done) {
            var matches, matchesCount, makeStub;

            matchesCount = 5;
            matches = _.map(new Array(matchesCount), function() {
                return [chance.word()]
            });

            sinon.stub(parser, "_execMultiple", function() {
                return matches;
            });

            makeStub = sinon.stub(parser, "_make", function() {
                return RSVP.Promise.resolve(null);
            });

            parser.parse(chance.word())
                .then(function() {
                    expect(makeStub.callCount).equal(matchesCount);

                    _.forEach(matches, function(match, index) {
                        var call;

                        call = makeStub.getCall(index);

                        expect(call.calledWithExactly(match)).to.be.true();
                        expect(call.calledOn(parser)).to.be.true();
                    });
                })
                .then(done, done);
        });

        it("should parse string", function(done) {
            var matches, results, matchesCount, makeStub, glue;

            makeStub = sinon.stub(parser, "_make");

            matchesCount = 5;
            matches = _.map(new Array(matchesCount), chance.word.bind(chance));
            results = _.map(new Array(matchesCount), function(v, index) {
                var result;

                result = chance.word();

                switch (index) {
                    case 0: {
                        makeStub.onCall(index).returns(RSVP.Promise.resolve({
                            toString: function() {
                                return result;
                            }
                        }));

                        break;
                    }

                    default: {
                        makeStub.onCall(index).returns(RSVP.Promise.resolve(result));

                        break;
                    }
                }

                return result;
            });

            sinon.stub(parser, "_execMultiple", function() {
                return matches.map(function(string) {
                    return [string];
                });
            });

            parser.parse(matches.join(glue = chance.word()))
                .then(function(str) {
                    expect(str).equal(results.join(glue));
                })
                .then(done, done);
        });

    });

});

