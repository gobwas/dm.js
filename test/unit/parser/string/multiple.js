var _              = require('lodash'),
    sinon          = require('sinon'),
    chai           = require('chai'),
    MultipleParser = require('../../../../lib/parser/string/multiple'),
    Template       = require('../../../../lib/parser/string/template'),
    Async          = require('../../../../lib/async'),
    Provider       = require('../../../../lib/provider'),
    Chance         = require("chance"),
    RSVP           = require("rsvp"),
    assert, expect;

assert = chai.assert;
expect = chai.expect;
chance = new Chance;

describe("MultipleParser", function() {
    var parser, async, template, provider;

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

        // create instance of Template
        template = Object.create(Template.prototype);

        parser = new MultipleParser(async, template, provider);
    });

    describe("#parse", function() {

        it("should call template#all with given string", function(done) {
            var mock, str;

            str = chance.word();

            mock = sinon.mock(template);
            mock.expects("all")
                .once()
                .withExactArgs(str)
                .on(template)
                .returns([]);

            parser.parse(str)
                .then(function() {
                    mock.verify();
                })
                .then(done, done);
        });

        it("should call #get with every match definition", function(done) {
            var matches, matchesCount, providerGetStub;

            matchesCount = 5;
            matches = _.map(new Array(matchesCount), function() {
                return { match: chance.word(), definition: {} };
            });

            sinon.stub(template, "all", function() {
                return matches;
            });

            providerGetStub = sinon.stub(provider, "get", function() {
                return RSVP.Promise.resolve(null);
            });

            parser.parse(chance.word())
                .then(function() {
                    expect(providerGetStub.callCount).equal(matchesCount);

                    _.forEach(matches, function(match, index) {
                        var call;

                        call = providerGetStub.getCall(index);

                        expect(call.calledWithExactly(match.definition)).to.be.true();
                        expect(call.calledOn(provider)).to.be.true();
                    });
                })
                .then(done, done);
        });

        it("should return list of results", function(done) {
            var matches, expectations, matchesCount, providerGetStub, glue;

            providerGetStub = sinon.stub(provider, "get");

            matchesCount = 5;
            matches = _.map(new Array(matchesCount), chance.word.bind(chance));

            sinon.stub(template, "all", function() {
                return matches.map(function(string) {
                    return { match: string, definition: {} };
                });
            });

            expectations = matches.map(function(str, index) {
                var result;

                result = chance.word();

                providerGetStub.onCall(index).returns(RSVP.Promise.resolve(result));

                return {
                    match:  str,
                    result: result
                };
            });

            parser.parse(chance.word())
                .then(function(response) {
                    expect(response).deep.equal(expectations);
                })
                .then(done, done);
        });

    });

});

