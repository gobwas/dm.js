var _      = require('lodash'),
    chance = require('chance'),
    sinon  = require('sinon'),
    chai   = require('chai'),
    util   = require("util"),
    DM     = require('../src/dm.js'),
    Loader = require('../src/dm/loader'),
    Async  = require('../src/dm/async'),
    RSVP   = require('rsvp'),
    assert, expect;

chance = new chance;
assert = chai.assert;
expect = chai.expect;

describe("DM", function() {
    var async, loader, dm;

    beforeEach(function() {
        async  = Object.create(Async.prototype);
        loader = Object.create(Loader.prototype);

        dm = new DM(async, loader);
    });

    describe("constructor", function() {

        it("should throw error when calling without `new`", function() {
            expect(DM).to.throw(Error, "Use constructor with the `new` operator");
        });

        it("should throw error when async is not given", function() {
            expect(function() { new DM() }).to.throw(TypeError, "Async is expected");
        });

        it("should throw error when loader is not given", function() {
            expect(function() { new DM(async) }).to.throw(TypeError, "Loader is expected");
        });

        it("should throw error when config is not an Object", function() {
            expect(function() { new DM(async, loader, "bad") }).to.throw(TypeError, "Config is expected to be an Object");
        });

        it("should throw error when config is not an Object", function() {
            expect(function() { new DM(async, loader, "bad") }).to.throw(TypeError, "Config is expected to be an Object");
        });

        it("should parse config if given", function() {
            var service, definition, services,
                parameter, value, parameters,
                dm;

            (services = {})[(service = chance.word())] = (definition = {});
            (parameters = {})[(parameter = chance.word())] = (value = {});

            dm = new DM(async, loader, {
                parameters: parameters,
                services: services
            });

            expect(dm.getDefinition(service)).equal(definition);
            expect(dm.getParameter(parameter)).equal(value);
        });
    });

    describe("instance", function() {
        describe("#setDefinition", function() {
            it("should throw error when key is not a string", function() {
                expect(dm.setDefinition).to.throw(TypeError, "Key is expected to be a string");
            });

            it("should throw error when definition is not object", function() {
                expect(dm.setDefinition.bind(dm, chance.word())).to.throw(TypeError, "Definition is expected to be an Object");
            });

            it("should throw error when definition is already set", function() {
                var key;

                key = chance.word();

                function setDefinition() {
                    dm.setDefinition(key, {});
                }

                setDefinition();

                expect(setDefinition).to.throw(Error, util.format("Definition for the service '%s' has been already set", key));
            });
        });

        describe("#getDefinition", function() {
            it("should throw error when key is not a string", function() {
                expect(dm.getDefinition.bind(dm)).to.throw(TypeError, "Key is expected to be a string");
            });

            it("should return cloned copy of object value", function() {
                var key, definition;

                dm.setDefinition((key = chance.word()), (definition = {}));

                expect(dm.getDefinition(key)).equal(definition);
            });
        });

        describe("#setParameter", function() {
            it("should throw error when key is not a string", function() {
                expect(dm.setParameter.bind(dm)).to.throw(TypeError, "Key is expected to be a string");
            });

            it("should throw error when parameter is already set", function() {
                var key;

                key = chance.word();

                function setParameter() {
                    dm.setParameter(key, chance.word());
                }

                setParameter();

                expect(setParameter).to.throw(Error, util.format("Parameter '%s' is already exists", key));
            });
        });

        describe("#getParameter", function() {
            it("should throw error when key is not a string", function() {
                expect(dm.getParameter.bind(dm)).to.throw(TypeError, "Key is expected to be a string");
            });

            it("should return the value", function() {
                var key, value;

                dm.setParameter((key = chance.word()), (value = chance.word()));

                expect(dm.getParameter(key)).equal(value);
            });
        });

        describe("#parse", function() {

            it("should return promise, resolved with given value if it is not a string, array or an object", function(done) {

                sinon.stub(async, "all", function(list) {
                    return RSVP.Promise.all(list);
                });

                sinon.stub(async, "promise", function(cb) {
                    return new RSVP.Promise(cb);
                });

                RSVP
                    .all(_.map([null, 1, undefined, new Error, {}], function(value) {
                        var asyncMock;

                        (asyncMock = sinon.mock(async))
                            .expects("resolve")
                            .returns(RSVP.Promise.resolve(value))
                            .once()
                            .on(async)
                            .calledWithExactly(value);

                        return dm
                            .parse(value)
                            .then(function() {
                                asyncMock.verify();
                                asyncMock.restore();
                            });
                    }))
                    .then(done, done);
            });

            it("should return result of async.promise", function() {
                var dm, async;

                // make async resolution empty
                async = new Async();
                sinon.stub(async, "promise", function() {
                    return new RSVP.Promise(_.noop);
                });

                dm = new DM(async, loader);

                expect(dm.parse(chance.word())).to.be.instanceof(RSVP.Promise);

                assert.ok(async.promise.callCount == 1);
            });


            // string

            var dm, async, loader;

            beforeEach(function() {
                // async
                async = new Async;
                sinon.stub(async, "promise", function(resolver) {
                    return new RSVP.Promise(resolver);
                });

                // loader
                loader = new Loader;

                // dm
                dm = new DM(async, loader);
            });


            it("should call parser#test method with given is a string", function() {

            });

            it("should call parser#parse if string is acceptable to parse", function() {

            });

            it("should return given string if it is not acceptable to parse", function() {

            });

            // object

            it("should resolve with unescaped object if it was escaped by DM#escape", function() {

            });

            it("should recursively call parse for every value of an object", function() {

            });

        });

        describe("#getResource", function() {

            it("should throw error when path is not a string", function() {

            });

            it("should return a promise", function() {

            });

            it("should call loader#read with path", function() {

            });

            it("should pass options.handler to loader, and resolve with loader#read call result, when handler is not a Function", function() {

            });

            it("should pass loader#read result to a handler and resolve with handler call result if it is a Function", function() {

            });

        });

        describe("#has", function() {

            it("should throw error when key is not a string", function() {

            });

            it("should call #getConfig method with given key", function() {

            });

            it("should return boolean", function() {

            });

        });

        describe("#initialized", function() {

            it("should throw error when key is not a string", function() {

            });

            it("should check dm.services with given key", function() {

            });

            it("should return boolean", function() {

            });

        });

        describe("#set", function() {

            it("should throw error when key is not a string", function() {

            });

            it("should throw error when service is not configured", function() {

            });

            it("should retrieve config with #getConfig with given key", function() {

            });

            it("should throw error when service is not synthetic", function() {

            });

            it("should set promise, resolved with service in dm.services by given key", function() {

            });

        });

        describe("#get", function() {
            // todo
        });

    })

});