var _        = require('lodash'),
    sinon    = require('sinon'),
    chai     = require('chai'),
    ProxyFactory = require("../../../lib/factory/proxy"),
    assert, expect;

assert = chai.assert;
expect = chai.expect;

describe("ProxyFactory", function() {
    var factory;

    beforeEach(function() {
        factory = new ProxyFactory();
    });

    describe("#factory", function() {

        it("should return operand", function() {
            var result, resp;

            result = factory.factory({
                operand: (resp = {})
            });

            expect(result).equal(resp);
        });

        it("should throw error when operand is not an object like", function() {
            var fac;

            fac = function() {
                factory.factory({
                    operand: null,
                    calls: [ ["method"] ]
                });
            };

            expect(fac).to.throw(Error, "Trying to call method of non object");
        });

        it("should throw error when method does not exists", function() {
            var fac;

            fac = function() {
                factory.factory({
                    operand: {},
                    calls: [ ["method"] ]
                });
            };

            expect(fac).to.throw(Error, "Trying to call method that does not exists: 'method'");
        });

        it("should make calls", function() {
            var that, method, createStub, args, resp;

            args = [{}];

            resp = {
                method: (method = sinon.spy())
            };

            factory.factory({
                operand: resp,
                calls: [ ["method", args] ]
            });

            expect(method.callCount).equal(1);
            expect(method.firstCall.calledOn(resp)).true();
            expect(method.firstCall.calledWithExactly.apply(method.firstCall, args)).true();
        });

        it("should throw error when operand is not an object like", function() {
            var fac;

            fac = function() {
                factory.factory({
                    operand: null,
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

            factory.factory({
                operand: (resp = {}),
                properties: props
            });

            expect(resp).to.have.property("a", 1);
            expect(resp).to.have.property("b", 2);
            expect(resp).to.have.property("c", 3);
        });

    });

});