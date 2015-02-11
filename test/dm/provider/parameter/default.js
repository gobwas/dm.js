var DefaultParameterProvider = require("../../../../src/dm/provider/parameter/default"),
    DM     = require("../../../../src/dm"),
    Async  = require("../../../../src/dm/async"),
    Chance = require("chance"),
    chai   = require("chai"),
    sinon  = require("sinon"),
    RSVP   = require("rsvp"),
    chance;

expect = chai.expect;
chance = new Chance;

describe("DefaultParameterProvider", function() {
    var provider, dm, async;

    beforeEach(function() {
        dm = Object.create(DM.prototype);

        async = Object.create(Async.prototype);
        sinon.stub(async, "promise", function(cb) {
            return new RSVP.Promise(cb);
        });

        provider = new DefaultParameterProvider(dm, async);
    });

    describe("#get", function() {

        it("should throw error when definition is not given", function() {
            expect(provider.get.bind(provider)).to.throw(TypeError, "Object is expected");
        });

        it("should throw error when definition.name is not a string", function() {
            expect(provider.get.bind(provider, {})).to.throw(TypeError, "Definition.name is expected to be a string");
        });

        it("should return promise", function() {
            sinon.stub(dm, "parse", function(str) {
                return RSVP.Promise.resolve(str);
            });
            expect(provider.get({ name: chance.word() })).to.be.instanceOf(RSVP.Promise);
        });

        it("should parse name", function(done) {
            var name;

            name = chance.word();

            sinon.stub(dm, "parse", function(str) {
                return RSVP.Promise.resolve(str);
            });
            sinon.stub(dm, "getParameter");

            provider
                .get({name: name})
                .then(function() {
                    var call;

                    expect(call = dm.parse.getCall(0)).to.exist();
                    expect(call.calledWithExactly(name)).to.be.true();
                })
                .then(done, done);
        });

        it("should call #getParameter of dm", function(done) {
            var name, param;

            name  = chance.word();
            param = chance.word();

            sinon.stub(dm, "parse", function(str) {
                return RSVP.Promise.resolve(str);
            });
            sinon.stub(dm, "getParameter", function() {
                return param;
            });

            provider
                .get({name: name})
                .then(function(response) {
                    var call;

                    expect(call = dm.getParameter.getCall(0)).to.exist();
                    expect(call.calledWithExactly(name)).to.be.true();
                    expect(response).equal(param);
                })
                .then(done, done);
        });

    });

});