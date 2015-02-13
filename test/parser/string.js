var _        = require('lodash'),
    sinon    = require('sinon'),
    chai     = require('chai'),
    Parser   = require('../../lib/parser/string'),
    Template = require('../../lib/parser/string/template'),
    Async    = require('../../lib/async'),
    Provider = require('../../lib/provider'),
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