var DefaultResourceProvider = require("../../../../lib/provider/resource/default"),
    DM     = require("../../../../lib/dm"),
    Async  = require("../../../../lib/async"),
    Chance = require("chance"),
    chai   = require("chai"),
    sinon  = require("sinon"),
    RSVP   = require("rsvp"),
    chance;

expect = chai.expect;
chance = new Chance;

describe("DefaultResourceProvider", function() {
    var provider, dm, async;

    beforeEach(function() {
        dm = Object.create(DM.prototype);

        async = Object.create(Async.prototype);
        sinon.stub(async, "promise", function(cb) {
            return new RSVP.Promise(cb);
        });
        sinon.stub(async, "all", function(promises) {
            return RSVP.Promise.all(promises);
        });

        provider = new DefaultResourceProvider(dm, async);
    });

    describe("#get", function() {

        it("should throw error when definition is not given", function() {
            expect(provider.get.bind(provider)).to.throw(TypeError, "Object is expected");
        });

        it("should throw error when definition.path is not a string", function() {
            expect(provider.get.bind(provider, {})).to.throw(TypeError, "Definition.path is expected to be a string");
        });

        it("should throw error when definition.handler is not a string", function() {
            expect(provider.get.bind(provider, {
                path: chance.word(),
                handler: null
            })).to.throw(TypeError, "Definition.handler is expected to be a string");
        });

        it("should return promise", function() {
            sinon.stub(dm, "parse", function(str) {
                return RSVP.Promise.resolve(str);
            });
            expect(provider.get({ path: chance.word() })).to.be.instanceOf(RSVP.Promise);
        });

        it("should parse definition", function(done) {
            var path, handler;

            path    = chance.word();
            handler = chance.word();

            sinon.stub(dm, "parse", function(str) {
                return RSVP.Promise.resolve(str);
            });
            sinon.stub(dm, "getResource");

            provider
                .get({ path: path, handler: handler })
                .then(function() {
                    [path, handler].forEach(function(str, index) {
                        var call;

                        expect(call = dm.parse.getCall(index)).to.exist();
                        expect(call.calledWithExactly(str)).to.be.true();
                    });
                })
                .then(done, done);
        });

        it("should call dm`s #getResource method with proper args and return result of it", function(done) {
            var path, handler, result;

            path = chance.word();
            handler = chance.word();
            result = {};

            sinon.stub(dm, "parse", function(str) {
                return RSVP.Promise.resolve(str);
            });
            sinon.stub(dm, "getResource", function() {
                return result;
            });

            provider
                .get({ path: path, handler: handler })
                .then(function(response) {
                    var call;

                    expect(dm.getResource.callCount).equal(1);
                    expect(call = dm.getResource.getCall(0)).is.exist();
                    expect(call.calledWithExactly(path, handler)).to.be.true();

                    expect(response).equal(result);
                })
                .then(done, done);
        });

    });

});