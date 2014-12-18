var _        = require('lodash'),
    sinon    = require('sinon'),
    chai     = require('chai'),
    Parser   = require('../../../src/dm/parser/string'),
    Async    = require('../../../src/dm/async'),
    Provider = require('../../../src/dm/provider'),
    assert, expect;

assert = chai.assert;
expect = chai.expect;

describe("Parser", function() {

    describe("#constructor", function() {

        it("should throw error when calling without provider", function() {
            function builder() {
                new Parser(sinon.createStubInstance(Async));
            }

            expect(builder).to.throw(TypeError, "Provider is expected");
        });

    });

});