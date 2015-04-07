var JSONPointerLoadProvider = require("../../../../lib/provider/load/json-pointer"),
    Async  = require("../../../../lib/async"),
    Loader = require("../../../../lib/loader"),
    Chance = require("chance"),
    chai   = require("chai"),
    sinon  = require("sinon"),
    RSVP   = require("rsvp"),
    jp     = require("json-pointer"),
    _      = require("lodash"),
    chance, expect;

expect = chai.expect;
chance = new Chance;

describe("JSONPointerLoadProvider", function() {
    var async, loader, provider;

    beforeEach(function() {
        async = Object.create(Async.prototype);
        sinon.stub(async, "resolve", RSVP.Promise.resolve.bind(RSVP.Promise));

        loader = Object.create(Loader.prototype);

        sinon.stub(jp, "get");

        provider = new JSONPointerLoadProvider(loader, async);
    });

    afterEach(function() {
        jp.get.restore();
    });

    describe("#get", function() {

        it("should throw error, when no definition given", function() {
            expect(provider.get.bind(provider)).to.throw(TypeError, "Object is expected");
        });

        it("should throw error, when definition has no path", function() {
            expect(provider.get.bind(provider, {})).to.throw(TypeError, "Definition.path is expected to be a string");
        });

        it("should throw error, when definition has no pointer", function() {
            expect(provider.get.bind(provider, {path: chance.word()})).to.throw(TypeError, "Definition.pointer is expected to be a string");
        });

        it("should call loader #require with path and async", function(done) {
            var path, pointer, breaker;

            breaker = {};
            path = chance.word();
            pointer = chance.word();

            sinon.stub(loader, "require", function() {
                return RSVP.Promise.reject(breaker);
            });

            provider.get({ path: path, pointer: pointer })
                .catch(function(err) {
                    if (err !== breaker) {
                        throw err;
                    }

                    expect(loader.require.callCount).equal(1);
                    expect(loader.require.firstCall.calledWithExactly(path, async)).true();
                })
                .then(done, done);
        });

        it("should call json-pointer #get with obj and pointer", function(done) {
            var path, pointer, obj, result;

            obj = {};
            result = {};
            path = chance.word();
            pointer = chance.word();

            sinon.stub(loader, "require", function() {
                return RSVP.Promise.resolve(obj);
            });

            jp.get.returns(result);

            provider.get({ path: path, pointer: pointer })
                .then(function(response) {
                    expect(response).equal(result);
                    expect(jp.get.callCount).equal(1);
                    expect(jp.get.firstCall.calledWithExactly(obj, pointer)).true();
                })
                .then(done, done);
        });

        it("should catch json-pointer errors", function(done) {
            var blablabla;

            blablabla = chance.word();

            sinon.stub(loader, "require", function() {
                return RSVP.Promise.resolve({});
            });

            jp.get.throws(new Error(blablabla));

            provider.get({ path: chance.word(), pointer: chance.word() })
                .then(function() {
                    done(new Error("O_O"));
                })
                .catch(function(err) {
                    expect(err).to.be.instanceOf(SyntaxError);
                    expect(err.message).equal("Could not apply JSON pointer: " + blablabla);
                })
                .then(done, done);
        });

    });
})

