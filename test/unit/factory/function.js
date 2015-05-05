var _        = require('lodash'),
    sinon    = require('sinon'),
    chai     = require('chai'),
    FunctionFactory = require("../../../lib/factory/function"),
    assert, expect;

assert = chai.assert;
expect = chai.expect;

describe("FunctionFactory", function() {
    var factory, func;

    beforeEach(function() {
        factory = new FunctionFactory();
        func = sinon.stub();
    });

    describe("#factory", function() {

        it("should return result of function call", function() {
            var result, resp;

            func.returns(resp = {});

            result = factory.factory({
                operand: func
            });

            expect(result).equal(resp);
        });

        it("should make call with arguments", function() {
            var args;

            args = [{}];

            factory.factory({
                operand: func,
                arguments: args
            });

            expect(func.callCount).equal(1);
            expect(func.firstCall.calledOn(undefined)).true();
            expect(func.firstCall.calledWithExactly.apply(func.firstCall, args)).true();
        });

        it("should throw error when factory provides non object like", function() {
            var fac;

            func.returns(null);

            fac = function() {
                factory.factory({
                    operand: func,
                    calls: [ ["method"] ]
                });
            };

            expect(fac).to.throw(Error, "Trying to call method of non object");
        });

        it("should throw error when method does not exists", function() {
            var fac;

            func.returns({});

            fac = function() {
                factory.factory({
                    operand: func,
                    calls: [ ["method"] ]
                });
            };

            expect(fac).to.throw(Error, "Trying to call method that does not exists: 'method'");
        });

        it("should make calls", function() {
            var method, args, resp;

            args = [{}];

            resp = {
                method: (method = sinon.spy())
            };

            func.returns(resp);

            factory.factory({
                operand: func,
                calls: [ ["method", args] ]
            });

            expect(method.callCount).equal(1);
            expect(method.firstCall.calledOn(resp)).true();
            expect(method.firstCall.calledWithExactly.apply(method.firstCall, args)).true();
        });

        it("should throw error when function provides not an object like", function() {
            var fac;

            func.returns(null);

            fac = function() {
                factory.factory({
                    operand: func,
                    calls: [ ["method"] ]
                });
            };

            expect(fac).to.throw(TypeError, "Trying to call method of non object");
        });

        it("should set properties", function() {
            var service, props, resp;

            props = {
                a: 1,
                b: 2,
                c: 3
            };

            func.returns(resp = {});

            factory.factory({
                operand: func,
                properties: props
            });

            expect(resp).to.have.property("a", 1);
            expect(resp).to.have.property("b", 2);
            expect(resp).to.have.property("c", 3);
        });
    });

});