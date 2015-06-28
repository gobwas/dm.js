var DeferredProvider = require("../../../lib/provider/deferred"),
    Provider = require("../../../lib/provider"),
    DM     = require("../../../lib/dm"),
    Async  = require("../../../lib/async"),
    Chance = require("chance"),
    chai   = require("chai"),
    sinon  = require("sinon"),
    RSVP   = require("rsvp"),
    _      = require("lodash"),
    chance, expect;

expect = chai.expect;
chance = new Chance;

describe("DeferredProvider", function() {
    var provider, dm, async, inner;

    beforeEach(function() {
        dm = Object.create(DM.prototype);

        async = Object.create(Async.prototype);
        sinon.stub(async, "resolve", function(val) {
            return RSVP.Promise.resolve(val);
        });
        sinon.stub(async, "promise", function(resolver) {
            return new RSVP.Promise(resolver);
        });

        inner = Object.create(Provider.prototype);

        provider = new DeferredProvider(dm, async, {}, inner);
    });

    describe("#constructor", function() {

        it("should throw error when inner is not a Provider", function() {
            expect(DeferredProvider.bind(null, dm, async, {})).to.throw(TypeError, "Provider is expected");
        });
    });

    describe("#get", function() {

        it("should return promised function", function(done) {
            provider
                .get()
                .then(function(f) {
                    expect(typeof f).equal("function");
                })
                .then(done, done);
        });

        it("should return function that returns promise", function(done) {
            provider
                .get()
                .then(function(func) {
                    expect(func()).to.be.instanceof(RSVP.Promise);
                })
                .then(done, done);
        });

        it("should return function that calls inner get with args", function(done) {
            var argA, argB, innerStub;

            argA = {};
            argB = {};

            innerStub = sinon.stub(inner, "get", function() {
                return RSVP.Promise.resolve();
            });

            provider
                .get(argA, argB)
                .then(function(func) {
                    return func();
                })
                .then(function() {
                    expect(innerStub.callCount).equal(1);
                    expect(innerStub.firstCall.calledWithExactly(argA, argB)).true();
                })
                .then(done, done);
        });

        it("should return function that calls inner get only once", function(done) {
            var innerStub;

            innerStub = sinon.stub(inner, "get", function() {
                return RSVP.Promise.resolve();
            });

            provider
                .get()
                .then(function(func) {
                    return RSVP
                        .all([
                            func(),
                            func(),
                            func()
                        ]);
                })
                .then(function() {
                    expect(innerStub.callCount).equal(1);
                })
                .then(done, done);
        });

    });

});