var DecoratorFactory = require("../../../lib/factory/decorator");
var Factory = require("../../../lib/factory");
var expect = require("chai").expect;
var sinon  = require("sinon");
var _      = require("lodash");
var chance = require("chance");

describe("DecoratorFactory", function() {

    describe("#constructor", function() {

        it("should throw error when no given factory", function() {
            // when
            function create() {
                new DecoratorFactory({});
            }

            // then
            expect(create).to.throw(TypeError, "Factory is expected");
        });

    });

    describe("#factory", function() {
        var instance, inner;

        beforeEach(function() {
            inner = Object.create(Factory.prototype);
            instance = new DecoratorFactory({}, inner);
        });

        it("should call inner factory on call", function() {
            var definition, response, factoryStub, result;

            // before
            definition = {};
            response = {};
            factoryStub = sinon.stub(inner, "factory", function() {
                return response;
            });

            // when
            result = instance.factory(definition);
            expect(result).to.be.a("function");

            // now call
            expect(result()).equal(response);
            expect(factoryStub.callCount).equal(1);
            expect(factoryStub.firstCall.calledWithExactly(definition)).to.be.true;
        });

    });

});