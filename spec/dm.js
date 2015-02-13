var DM        = require("../lib/dm"),
    RSVP      = require("rsvp"),
    RSVPAsync = require("../lib/async/rsvp"),
    CJSLoader = require("../lib/loader/cjs"),
    chai      = require("chai"),

    expect = chai.expect,

    config, dm;

config = {
    "parameters": {
        "param": 10
    },
    "services": {

        "serviceA": {
            "path": "./a.js",
            "arguments": [
                {
                    "option": true
                }
            ],
            "calls": [
                [
                    "textA",
                    ["#./text.txt#"]
                ],
                [
                    "textB",
                    ["#{./text.txt}-B"]
                ],
                [
                    "textC",
                    ["@{serviceB}-C"]
                ]
            ],
            "properties": {
                "propA": "%param%",
                "propB": "%{param}-B"
            }
        },

        "serviceB": {
            "path": "./b.js"
        }

    }
};

dm = new DM(new RSVPAsync(RSVP), new CJSLoader(require, { base: __dirname }), config);


describe("spec", function() {

    it("should work", function(done) {

        dm.get("serviceA")
            .then(function(service) {
                expect(service.textA.callCount).equal(1);
                expect(service.textA.firstCall.calledWithExactly("Hello, DM!")).to.be.true();

                expect(service.textB.callCount).equal(1);
                expect(service.textB.firstCall.calledWithExactly("Hello, DM!-B")).to.be.true();

                expect(service.textC.callCount).equal(1);
                expect(service.textC.firstCall.calledWithExactly("I am serviceB instance-C")).to.be.true();

                expect(service.propA).equal(10);
                expect(service.propB).equal("10-B");

                expect(service.options.option).equal(true);
            })
            .then(done, done);

    });

});

