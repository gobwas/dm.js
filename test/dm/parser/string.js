var _        = require('lodash'),
    sinon    = require('sinon'),
    chai     = require('chai'),
    Parser   = require('../../../src/dm/parser/string'),
    Template = require('../../../src/dm/parser/string/template'),
    Async    = require('../../../src/dm/async'),
    Provider = require('../../../src/dm/provider'),
    assert, expect;

assert = chai.assert;
expect = chai.expect;

describe("Parser", function() {

    describe("#constructor", function() {

        it("should throw error when calling without async", function() {
            function builder() {
                new Parser();
            }

            expect(builder).to.throw(TypeError, "Async is expected");
        });

        it("should throw error when calling without template", function() {
            function builder() {
                new Parser(Object.create(Async.prototype));
            }

            expect(builder).to.throw(TypeError, "Template is expected");
        });

        it("should throw error when calling without provider", function() {
            function builder() {
                new Parser(Object.create(Async.prototype), Object.create(Template.prototype));
            }

            expect(builder).to.throw(TypeError, "Provider is expected");
        });

    });

});