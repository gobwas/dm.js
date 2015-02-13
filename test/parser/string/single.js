var _              = require('lodash'),
    sinon          = require('sinon'),
    chai           = require('chai'),
    SingleParser = require('../../../lib/parser/string/single'),
    Template       = require('../../../lib/parser/string/template'),
    Async          = require('../../../lib/async'),
    Provider       = require('../../../lib/provider'),
    Chance         = require("chance"),
    RSVP           = require("rsvp"),
    assert, expect;

assert = chai.assert;
expect = chai.expect;
chance = new Chance;

describe("SingleParser", function() {
    var parser, async, template, provider;

    beforeEach(function () {
        // create instanceof Async
        async = Object.create(Async.prototype);
        sinon.stub(async, "promise", function (cb) {
            return new RSVP.Promise(cb);
        });
        sinon.stub(async, "resolve", function (val) {
            return RSVP.Promise.resolve(val);
        });

        // create instanceof Provider
        provider = Object.create(Provider.prototype);

        // create instance of Template
        template = Object.create(Template.prototype);

        parser = new SingleParser(async, template, provider);
    });

    describe("#parse", function() {

        it("should call template#match with given string", function(done) {
            var mock, str;

            str = chance.word();

            mock = sinon.mock(template);
            mock.expects("match")
                .once()
                .withExactArgs(str)
                .on(template)
                .returns({ match: chance.word(), definition: {} });

            sinon.stub(provider, "get", function() {
                return RSVP.Promise.resolve(null);
            });

            parser.parse(str)
                .then(function() {
                    mock.verify();
                })
                .then(done, done);
        });

        it("should call #get with match definition", function(done) {
            var match, mock;

            match = { match: chance.word(), definition: {} };

            sinon.stub(template, "match", function() {
                return match;
            });

            mock = sinon.mock(provider);
            mock.expects("get")
                .once()
                .withExactArgs(match.definition)
                .on(provider)
                .returns(RSVP.Promise.resolve(null));

            parser.parse(chance.word())
                .then(function() {
                    mock.verify();
                })
                .then(done, done);
        });

        it("should return result of provider#get", function() {
            var response;

            response = {};

            sinon.stub(template, "match", function() {
                return { match: chance.word(), definition: {} };
            });
            sinon.stub(provider, "get", function() {
                return response;
            });

            expect(parser.parse(chance.word())).equal(response);
        });

    });

});
