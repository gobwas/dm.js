var chai     = require("chai"),
    Async    = require("../../src/dm/async"),
    Provider = require("../../src/dm/provider"),
    expect;

expect = chai.expect;

describe("Provider", function() {

    describe("#constructor", function() {

        it("should throw error when dm is not an Object", function() {
            expect(Provider.bind(null)).to.throw(TypeError, "Object is expected");
        });

        it("should throw error when async is not an Async", function() {
            expect(Provider.bind(null, {})).to.throw(TypeError, "Async is expected");
        });

    });

});