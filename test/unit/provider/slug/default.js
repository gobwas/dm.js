var DefaultSlugProvider = require("../../../../lib/provider/slug/default"),
    DM     = require("../../../../lib/dm"),
    Async  = require("../../../../lib/async"),
    Chance = require("chance"),
    chai   = require("chai"),
    sinon  = require("sinon"),
    RSVP   = require("rsvp"),
    _      = require("lodash"),
    chance, expect;

expect = chai.expect;
chance = new Chance;

describe("DefaultSlugProvider", function() {
    var provider, dm, async, slugs;

    beforeEach(function() {
        slugs = [];

        dm = Object.create(DM.prototype);

        async = Object.create(Async.prototype);
        sinon.stub(async, "resolve", function(val) {
            return RSVP.Promise.resolve(val);
        });

        provider = new DefaultSlugProvider(dm, async, {}, slugs);
    });

    describe("#get", function() {

        it("should throw error when definition is not given", function() {
            expect(provider.get.bind(provider)).to.throw(TypeError, "Object is expected");
        });

        it("should throw error when definition.index is not a number", function() {
            expect(provider.get.bind(provider, {})).to.throw(TypeError, "Definition.index is expected to be a number");
        });

        it("should return promise", function() {
            sinon.stub(dm, "parse", function(str) {
                return RSVP.Promise.resolve(str);
            });
            expect(provider.get({ index: chance.integer() })).to.be.instanceOf(RSVP.Promise);
        });

        it("should return value", function(done) {
            var value;

            value = chance.word();
            slugs.push(value);

            provider
                .get({ index: 0 })
                .then(function(response) {
                    expect(response).equal(value);
                })
                .then(done, done);
        });
    });

});