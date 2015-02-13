var _      = require('lodash'),
    chance = require('chance'),
    sinon  = require('sinon'),
    chai   = require('chai'),
    util   = require("util"),
    DM     = require('../../lib/dm'),
    Loader = require('../../lib/loader'),
    Async  = require('../../lib/async'),
    RSVP   = require('rsvp'),
    assert, expect;

chance = new chance;
assert = chai.assert;
expect = chai.expect;

describe("DM", function() {
    var async, loader, dm;

    beforeEach(function() {
        async  = Object.create(Async.prototype);
        sinon.stub(async, "all", function(list) {
            return RSVP.Promise.all(list);
        });
        sinon.stub(async, "promise", function(cb) {
            return new RSVP.Promise(cb);
        });
        sinon.stub(async, "resolve", function(value) {
            return RSVP.Promise.resolve(value);
        });
        sinon.stub(async, "reject", function(err) {
            return RSVP.Promise.reject(err);
        });

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
            var list;

            it("should return promise, resolved with given value if it is not a string, array or an object", function(done) {
                RSVP
                    .all((list = [null, chance.natural(), chance.floating(), undefined, new Error]).map(function(value, index) {
                        return dm.parse(value);
                    }))
                    .then(function(results) {
                        results.forEach(function(result, index) {
                            var call;

                            expect(call = async.resolve.getCall(index)).to.exist();
                            expect(call.calledWithExactly(list[index])).to.be.true();
                            expect(result).equal(list[index]);
                        });
                    })
                    .then(done)
                    .catch(done);
            });

            it("should return result of async.promise", function() {
                expect(dm.parse(chance.word())).to.be.instanceof(RSVP.Promise);
            });

            it("should return synthetic service", function(done) {
                var key, service;

                key = chance.word();
                service = {};

                dm.setDefinition(key, {
                    synthetic: true
                });

                dm
                    .parse("@" + key)
                    .then(function(result) {
                        expect(result).equal(service);
                    })
                    .then(done, done);

                dm.set(key, service);
            });

            // object

            it("should resolve with unescaped object if it was escaped by DM#escape", function(done) {
                var escaped, target;

                escaped = DM.escape((target = { a: "@" + chance.word() }));

                dm
                    .parse(escaped)
                    .then(function(result) {
                        expect(result).equal(target);
                    })
                    .then(done, done);
            });

            it("should recursively call parse for every value of an object", function(done) {
                var iterable, keys, spy,
                    calls;

                calls = [];

                function extractCalls(obj) {
                    calls.push(obj);

                    if (_.isObject(obj) || _.isArray(obj)) {
                        _.forEach(obj, function(value) {
                            extractCalls(value);
                        });
                    }
                }

                function makeRandomObj(recursive, obj) {
                    return _.reduce(new Array(chance.natural({min: 3, max: 7})), function(result, value, index) {
                        var val;

                        if (obj) {
                            result[chance.word()] = chance.word();
                        } else {
                            switch (index) {
                                case 1: {
                                    val = recursive ? makeRandomObj(false, false) : makeRandomObj(false, true);
                                    break;
                                }

                                default: {
                                    val = chance.word();
                                    break;
                                }
                            }

                            result.push(val);
                        }

                        return result;
                    }, obj ? {} : []);
                }

                iterable = makeRandomObj(true);
                extractCalls(iterable);

                sinon.spy(dm, "parse");

                dm
                    .parse(iterable)
                    .then(function() {
                        _.forEach(calls, function(target, index) {
                            var call;

                            expect(call = dm.parse.getCall(index)).to.exist();
                            expect(call.calledWithExactly(target)).to.be.true();
                        });
                    })
                    .then(done, done);
            });

        });

        describe("#has", function() {

            it("should throw error when key is not a string", function() {
                expect(dm.has.bind(dm)).to.throw(TypeError, "Key is expected to be a string");
            });

            it("should call #getDefinition method with given key", function() {
                var key;

                key = chance.word();

                sinon.spy(dm, "getDefinition");

                dm.has(key);

                expect(dm.getDefinition.getCall(0).calledWithExactly(key)).to.be.true();
            });

            it("should return boolean", function() {
                var key;

                key = chance.word();
                dm.setDefinition(key, {
                    synthetic: true
                });

                expect(dm.has(chance.word())).to.be.false();
                expect(dm.has(key)).to.be.true();
            });

        });

        describe("#initialized", function() {

            it("should throw error when key is not a string", function() {
                expect(dm.initialized.bind(dm)).to.throw(TypeError, "Key is expected to be a string");
            });

            it("should check dm.services with given key", function() {
                var key;

                key = chance.word();
                dm.setDefinition(key, {
                    synthetic: true
                });
                dm.set(key, {});

                expect(dm.initialized(key)).to.be.true();
                expect(dm.initialized(chance.word())).to.be.false();
            });

        });

        describe("#set", function() {

            it("should throw error when key is not a string", function() {
                expect(dm.set.bind(dm)).to.throw(TypeError, "Key is expected to be a string");
            });

            it("should throw error when service is not configured", function() {
                var key;

                key = chance.word();

                expect(dm.set.bind(dm, key)).to.throw(Error, "Definition is not found for the '" + key + "' service");
            });

            it("should throw error when service is not synthetic", function() {
                var key;

                key = chance.word();
                dm.setDefinition(key, {});

                expect(dm.set.bind(dm, key, {})).to.throw(Error, "Could not inject non synthetic service '" + key + "'");
            });

            it("should throw error when service is already initialized", function() {
                var key;

                key = chance.word();
                dm.setDefinition(key, {
                    synthetic: true
                });
                dm.set(key, {});

                expect(dm.set.bind(dm, key, {})).to.throw(Error, "Service '" + key + "' is already set");
            });

            it("should fulfill deferred requests", function(done) {
                var key, service;

                key = chance.word();
                service = {};
                dm.setDefinition(key, {
                    synthetic: true
                });

                RSVP
                    .all(_.map(new Array(chance.natural({min: 3, max: 10})), function() {
                        return dm.get(key);
                    }))
                    .then(function(results) {
                        _.forEach(results, function(result) {
                            expect(result).to.be.equal(service);
                        })
                    })
                    .then(done, done);

                dm.set(key, service);
            });

        });

        describe("#get", function() {

            it("should throw error when key is not a string", function() {
                expect(dm.get.bind(dm)).to.throw(TypeError, "Key is expected to be a string");
            });

            it("should throw error when service has no definition", function(done) {
                var key;

                key = chance.word();

                dm.get(key)
                    .catch(function(err) {
                        expect(err).to.be.instanceOf(Error);
                        expect(err.message).equal("Definition is not found for the '" + key + "' service")
                    })
                    .then(done, done);
            });

            it("should throw error when service has no path and not alias or synthetic", function(done) {
                var key;

                key = chance.word();

                dm.setDefinition(key, {});

                dm.get(key)
                    .catch(function(err) {
                        expect(err).to.be.instanceOf(Error);
                        expect(err.message).equal("Path is expected in definition of service '" + key + "'")
                    })
                    .then(done, done);
            });

            it("should return forthcoming promise for synthetic service", function() {
                var key;

                key = chance.word();

                dm.setDefinition(key, {
                    synthetic: true
                });

                expect(dm.get(key)).to.be.instanceOf(RSVP.Promise);
            });

            it("should return aliased service", function(done) {
                var key, alias, service;

                key = chance.word();
                alias = chance.word();
                service = {};

                dm.setDefinition(key, {
                    alias: alias
                });

                dm.setDefinition(alias, {
                    synthetic: true
                });

                dm.set(alias, service);

                dm
                    .get(key)
                    .then(function(result) {
                        expect(result).to.be.equal(service);
                    })
                    .then(done, done);
            });

            it("should throw error when aliased service is not defined", function(done) {
                var key, alias;

                key = chance.word();
                alias = chance.word();

                dm.setDefinition(key, {
                    alias: alias
                });

                dm
                    .get(key)
                    .catch(function(err) {
                        expect(err).to.be.instanceOf(Error);
                        expect(err.message).equal("Service '" + key + "' could not be alias for not existing '" + alias + "' service");
                    })
                    .then(done, done);
            });

            it("should build every time new service, when sharing is off", function(done) {
                var key;

                key = chance.word();

                // stub loader
                // return Object constructor
                sinon.stub(loader, "require", function() {
                    return RSVP.Promise.resolve(Object);
                });

                dm.setDefinition(key, {
                    path: chance.word(),
                    share: false
                });

                RSVP
                    .all(_.map(new Array(chance.natural({min: 2, max: 10})), function() {
                        return dm.get(key);
                    }))
                    .then(function(results) {
                        expect(_.uniq(results).length).to.be.equal(results.length);
                    })
                    .then(done, done);
            });

            it("should build once new service, and return one instance, when sharing is on", function(done) {
                var key;

                key = chance.word();

                // stub loader
                // return Object constructor
                sinon.stub(loader, "require", function() {
                    return RSVP.Promise.resolve(Object);
                });

                dm.setDefinition(key, {
                    path: chance.word(),
                    share: true
                });

                RSVP
                    .all(_.map(new Array(chance.natural({min: 2, max: 10})), function() {
                        return dm.get(key);
                    }))
                    .then(function(results) {
                        expect(_.uniq(results).length).to.be.equal(1);
                    })
                    .then(done, done);
            });

        });

    })

});