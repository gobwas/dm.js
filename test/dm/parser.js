var _        = require('lodash'),
    sinon    = require('sinon'),
    chai     = require('chai'),
    Parser   = require('../../src/dm/parser'),
    Async    = require('../../src/dm/async'),
    Provider = require('../../src/dm/provider'),
    assert, expect;

assert = chai.assert;
expect = chai.expect;

describe("Parser", function() {

    describe("constructor", function() {
        it("should throw error when calling without async", function() {
            function builder() {
                new Parser();
            }

            expect(builder).to.throw(TypeError, "Async is expected");
        });

        it("should land options", function() {
            var parser;

            parser = new Parser(sinon.createStubInstance(Async), { a: 1 });

            expect(parser.options).to.have.property("a", 1);
        });
    })

});