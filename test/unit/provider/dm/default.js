var DefaultDMProvider = require("../../../../lib/provider/dm/default"),
    DM     = require("../../../../lib/dm"),
    Async  = require("../../../../lib/async"),
    Chance = require("chance"),
    chai   = require("chai"),
    sinon  = require("sinon"),
    RSVP   = require("rsvp"),
    chance;

expect = chai.expect;
chance = new Chance;

describe("DefaultDMProvider", function() {
    var provider, dm, async;

    beforeEach(function() {
        dm = Object.create(DM.prototype);

        async = Object.create(Async.prototype);
        sinon.stub(async, "resolve", function(obj) {
            return RSVP.Promise.resolve(obj);
        });

        provider = new DefaultDMProvider(dm, async);
    });

    describe("#get", function() {

        it("should return promise", function() {
            expect(provider.get()).to.be.instanceOf(RSVP.Promise);
        });

        it("should return reference to dm", function(done) {
            provider.get()
                .then(function(result) {
                    expect(result).equal(dm);
                })
                .then(done, done);
        });

    });

});