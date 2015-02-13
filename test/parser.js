var _        = require('lodash'),
    sinon    = require('sinon'),
    chai     = require('chai'),
    Parser   = require('../lib/parser'),
    Async    = require('../lib/async'),
    Provider = require('../lib/provider'),
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