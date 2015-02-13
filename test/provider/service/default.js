var DefaultServiceProvider = require("../../../lib/provider/service/default"),
    DM     = require("../../../lib/dm"),
    Async  = require("../../../lib/async"),
    Chance = require("chance"),
    chai   = require("chai"),
    sinon  = require("sinon"),
    RSVP   = require("rsvp"),
    _      = require("lodash"),
    chance;

expect = chai.expect;
chance = new Chance;

describe("DefaultServiceProvider", function() {
    var provider, dm, async;

    beforeEach(function() {
        dm = Object.create(DM.prototype);

        async = Object.create(Async.prototype);
        sinon.stub(async, "promise", function(cb) {
            return new RSVP.Promise(cb);
        });
        sinon.stub(async, "all", function(promises) {
            return RSVP.Promise.all(promises);
        });

        provider = new DefaultServiceProvider(dm, async);
    });

    describe("#get", function() {

        it("should throw error when definition is not given", function() {
            expect(provider.get.bind(provider)).to.throw(TypeError, "Object is expected");
        });

        it("should throw error when definition.name is not a string", function() {
            expect(provider.get.bind(provider, {})).to.throw(TypeError, "Definition.name is expected to be a string");
        });

        it("should throw error when definition.property is given and not a string", function() {
            expect(provider.get.bind(provider, {
                name:     chance.word(),
                property: null
            })).to.throw(TypeError, "Definition.property is expected to be a string");
        });

        it("should throw error when definition.args is given and not a string", function() {
            expect(provider.get.bind(provider, {
                name: chance.word(),
                args: null
            })).to.throw(TypeError, "Definition.args is expected to be an Array");
        });

        it("should return promise", function() {
            sinon.stub(dm, "parse", function(str) {
                return RSVP.Promise.resolve(str);
            });
            expect(provider.get({ name: chance.word() })).to.be.instanceOf(RSVP.Promise);
        });

        it("should parse definition", function(done) {
            var name, property, args, service;

            name     = chance.word();
            property = chance.word();
            args     = _.map(new Array(3), chance.word.bind(chance));

            service  = {};
            service[property] = sinon.spy();

            sinon.stub(dm, "parse", function(str) {
                return RSVP.Promise.resolve(str);
            });
            sinon.stub(dm, "get", function() {
                return RSVP.Promise.resolve(service);
            });

            provider
                .get({ name: name, property: property, args: args })
                .then(function() {
                    [name, property].concat(args).forEach(function(str, index) {
                        var call;

                        expect(call = dm.parse.getCall(index)).to.exist();
                        expect(call.calledWithExactly(str)).to.be.true();
                    });
                })
                .then(done, done);
        });

        it("should return service", function(done) {
            var name, service;

            name = chance.word();
            service = {};

            sinon.stub(dm, "parse", function(str) {
                return RSVP.Promise.resolve(str);
            });
            sinon.stub(dm, "get", function() {
                return RSVP.Promise.resolve(service);
            });

            provider
                .get({ name: name })
                .then(function(response) {
                    expect(response).equal(service);
                })
                .then(done, done);
        });

        it("should return property", function(done) {
            var name, property, value;

            name     = chance.word();
            property = chance.word();
            value    = chance.word();

            sinon.stub(dm, "parse", function(str) {
                return RSVP.Promise.resolve(str);
            });
            sinon.stub(dm, "get", function() {
                var service;

                service = {};
                service[property] = value;

                return RSVP.Promise.resolve(service);
            });

            provider
                .get({ name: name, property: property })
                .then(function(response) {
                    expect(response).equal(value);
                })
                .then(done, done);
        });

        it("should call method and return result", function(done) {
            var name, property, method, args, result;

            name     = chance.word();
            property = chance.word();

            result   = {};
            args     = _.map(new Array(3), chance.word.bind(chance));

            method   = sinon.spy(function() {
                return result;
            });

            sinon.stub(dm, "parse", function(str) {
                return RSVP.Promise.resolve(str);
            });
            sinon.stub(dm, "get", function() {
                var service;

                service = {};
                service[property] = method;

                return RSVP.Promise.resolve(service);
            });

            provider
                .get({ name: name, property: property, args: args })
                .then(function(response) {
                    var call;

                    expect(method.callCount).equal(1);
                    expect(call = method.getCall(0)).to.exist();
                    expect(call.calledWithExactly.apply(call, args)).to.be.true();

                    expect(response).equal(result);
                })
                .then(done, done);
        });

        it("should throw error when property is not exists", function(done) {
            var name, property;

            name     = chance.word();
            property = chance.word();

            sinon.stub(dm, "parse", function(str) {
                return RSVP.Promise.resolve(str);
            });
            sinon.stub(dm, "get", function() {
                return RSVP.Promise.resolve({});
            });

            provider
                .get({ name: name, property: property })
                .then(function() {
                    done(new Error("Expected rejection, but fulfilled"));
                })
                .catch(function(err) {
                    expect(err).to.be.instanceOf(Error);
                    expect(err.message).equal("Service '" + name + "' does not have the property '" + property + "'");
                })
                .then(done, done);
        });

        it("should throw error when method is not exists", function(done) {
            var name, property;

            name     = chance.word();
            property = chance.word();

            sinon.stub(dm, "parse", function(str) {
                return RSVP.Promise.resolve(str);
            });
            sinon.stub(dm, "get", function() {
                var obj;

                (obj = {})[property] = chance.word();

                return RSVP.Promise.resolve(obj);
            });

            provider
                .get({ name: name, property: property, args: [] })
                .then(function() {
                    done(new Error("Expected rejection, but fulfilled"));
                })
                .catch(function(err) {
                    expect(err).to.be.instanceOf(Error);
                    expect(err.message).equal("Service '" + name + "' does not have the method '" + property + "'");
                })
                .then(done, done);
        });

    });

});