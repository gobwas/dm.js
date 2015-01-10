var _      = require('lodash'),
    chance = require('chance'),
    sinon  = require('sinon'),
    chai   = require('chai'),
    DM     = require('../src/dm.js'),
    Loader = require('../src/dm/loader'),
    Async  = require('../src/dm/async'),
    RSVP   = require('rsvp'),
    assert, expect;

chance = new chance;
assert = chai.assert;
expect = chai.expect;

describe("DM", function() {

    describe("constructor", function() {

        it("should throw error when calling without `new`", function() {
            expect(DM).to.throw(Error, "Use constructor with the `new` operator");
        });

        it("should throw error when async is not given", function() {
            expect(function() { new DM() }).to.throw(TypeError, "Async is expected");
        });

        it("should throw error when loader is not given", function() {
            expect(function() { new DM(sinon.createStubInstance(Async)) }).to.throw(TypeError, "Loader is expected");
        });

        it("should throw error when options is not an Object", function() {
            expect(function() { new DM(sinon.createStubInstance(Async), sinon.createStubInstance(Loader), "bad") }).to.throw(TypeError, "Options is expected to be an Object");
        });

        it("should set default options for DM instance", function() {
            var dm;

            dm = new DM(sinon.createStubInstance(Async), sinon.createStubInstance(Loader));

            expect(dm.options).to.be.an.instanceOf(Object);

            _.forEach(DM.DEFAULTS, function(value, key) {
                expect(dm.options).to.have.property(key).that.equals(value);
            });
        });

    });

    describe("instance", function() {
        function makeSimpleDM() {
            return new DM(sinon.createStubInstance(Async), sinon.createStubInstance(Loader));
        }

        describe("#setConfig", function() {
            var dm;

            beforeEach(function() {
                dm = makeSimpleDM();
            });

            it("should work", function() {
                expect(dm.setConfig.bind(dm, {})).to.not.throw(Error);
            });

            it("should throw error when config is not object", function() {
                expect(dm.setConfig).to.throw(Error, "Config is expected to be an Object");
            });

            return it("should throw error when configuring twice", function() {
                dm.setConfig({});
                expect(dm.setConfig.bind(dm, {})).to.throw(Error, "Dependency Manager is already configured");
            });
        });

        describe("#getConfig", function() {
            var dm, config, strProp, strValue, objProp, objValue;

            before(function() {
                dm = makeSimpleDM();

                config = {};

                strProp  = chance.word();
                strValue = chance.word();
                objProp  = chance.word();
                objValue = { a: { b: "c" } };

                config[strProp] = strValue;
                config[objProp] = objValue;

                dm.setConfig(config);
            });

            it("should work", function() {
                expect(dm.getConfig.bind(dm, strProp)).to.not.throw(Error);
            });

            it("should throw error when key is not a string", function() {
                expect(dm.getConfig.bind(dm)).to.throw(TypeError, "Key is expected to be a string");
            });

            it("should return cloned copy of object value", function() {
                var result;

                result = dm.getConfig(objProp);

                expect(result).to.not.equal(objValue);
                expect(result).to.deep.equal(objValue);
            });
        });

        describe("#setParameters", function() {
            var dm;

            beforeEach(function() {
                dm = makeSimpleDM();
            });

            it("should work", function() {
                expect(dm.setParameters.bind(dm, {a : "b", c : { d: 1 }})).to.not.throw(Error);
            });

            it("should throw error when parameters is not object", function() {
                expect(dm.setParameters.bind(dm)).to.throw(TypeError, "Parameters is expected to be an Object");
            });

            return it("should call #setParameter method for each key", function() {
                var setParameterStub, len, keys, values, params;

                len = 5;

                keys =   _.map(new Array(len), chance.word.bind(chance));
                values = _.map(new Array(len), chance.word.bind(chance));

                params = _.zipObject(keys, values);

                setParameterStub = sinon.stub(dm, "setParameter");

                dm.setParameters(params);

                _.times(len, function(i) {
                    assert.ok(setParameterStub.getCall(i).calledWithExactly(keys[i], values[i]));
                });
            });
        });

        describe("#setParameter", function() {
            var dm;

            beforeEach(function() {
                dm = makeSimpleDM();
            });

            it("should work", function() {
                expect(dm.setParameter.bind(dm, chance.word(), chance.word())).to.not.throw(Error);
            });

            it("should throw error when key is not a string", function() {
                expect(dm.setParameter.bind(dm)).to.throw(TypeError, "Key is expected to be a string");
            });

            it("should throw error when parameter is already set", function() {
                var str;

                dm.setParameter((str = chance.word()));

                expect(dm.setParameter.bind(dm, str)).to.throw(Error, "Parameter '" + str + "' is already exists");
            });
        });

        describe("#getParameter", function() {
            var dm, params, strProp, strValue, objProp, objValue;

            before(function() {
                dm = makeSimpleDM();

                params = {};

                strProp  = chance.word();
                strValue = chance.word();
                objProp  = chance.word();
                objValue = { a: { b: "c" } };

                params[strProp] = strValue;
                params[objProp] = objValue;

                dm.setParameters(params);
            });

            it("should work", function() {
                expect(dm.getParameter.bind(dm, strProp)).to.not.throw(Error);
            });

            it("should throw error when key is not a string", function() {
                expect(dm.getParameter.bind(dm)).to.throw(TypeError, "Key is expected to be a string");
            });

            it("should return link to the value", function() {
                var result;

                result = dm.getParameter(objProp);

                expect(result).to.equal(objValue);
            });
        });

        describe("#parse", function() {

            it("should return promise, resolved with given value if it is not a string, array or an object", function() {

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