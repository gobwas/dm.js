var SimpleLoadProvider = require("../../../../lib/provider/load/simple"),
    Async              = require("../../../../lib/async"),
    Loader             = require("../../../../lib/loader"),
    Chance             = require("chance"),
    chai               = require("chai"),
    sinon              = require("sinon"),
    RSVP               = require("rsvp"),
    _                  = require("lodash"),
    chance, expect;

expect = chai.expect;
chance = new Chance;

describe("SimpleLoadProvider", function() {
    var async, loader, provider;

    beforeEach(function() {
        async = Object.create(Async.prototype);
        sinon.stub(async, "resolve", RSVP.Promise.resolve.bind(RSVP.Promise));

        loader = Object.create(Loader.prototype);

        provider = new SimpleLoadProvider(loader, async);
    });

    describe("#get", function() {

        it("should throw error, when no definition given", function() {
            expect(provider.get.bind(provider)).to.throw(TypeError, "Object is expected");
        });

        it("should throw error, when definition has no path", function() {
            expect(provider.get.bind(provider, {})).to.throw(TypeError, "Definition.path is expected to be a string");
        });

        it("should call loader #require with path and async", function(done) {
            var path, obj;

            path = chance.word();

            sinon.stub(loader, "require", function() {
                return RSVP.Promise.resolve(obj);
            });

            provider.get({ path: path })
                .then(function(result) {
                    expect(loader.require.callCount).equal(1);
                    expect(loader.require.firstCall.calledWithExactly(path, async)).true();
                    expect(result).equal(obj);
                })
                .then(done, done);
        });

    });
})

