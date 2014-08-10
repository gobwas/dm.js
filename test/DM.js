(function() {
  var Async, DM, Loader, RSVP, assert, chai, chance, sinon, _;

  _ = require('lodash');

  chance = require('chance');

  sinon = require('sinon');

  chai = require('chai');

  DM = require('../src/dm.js');

  Loader = require('../src/dm/adapter/loader');

  Async = require('../src/dm/adapter/async');

  RSVP = require('rsvp');

  chance = new chance;

  assert = chai.assert;

  suite("dm.js", function() {
    var randomPrimitivesHash;
    randomPrimitivesHash = function() {
      return _.reduce(new Array(chance.natural({
        min: 10,
        max: 100
      })), function(rnd) {
        rnd[chance.word()] = chance.integer();
        rnd[chance.word()] = chance.string();
        rnd[chance.word()] = chance.bool();
        return rnd;
      }, {});
    };
    setup(function() {});
    suite("#constructor", function() {
      var dm;
      dm = null;
      setup(function() {
        return dm = new DM;
      });
      return test("Should set default options for DM instance", function() {
        assert.isObject(dm.options);
        return _.forEach(dm.options, function(val, key) {
          return assert.strictEqual(val, DM.DEFAULTS[key]);
        });
      });
    });
    suite("#setConfig", function() {
      var config, dm, parameters;
      dm = null;
      config = null;
      parameters = null;
      setup(function() {
        dm = new DM;
        config = randomPrimitivesHash();
        return parameters = randomPrimitivesHash();
      });
      test("Should set config without errors", function() {
        var err, error;
        try {
          dm.setConfig(config, parameters);
        } catch (_error) {
          err = _error;
          error = err;
        }
        return assert.isUndefined(error);
      });
      test("Should throw Error if nothing given", function() {
        var err, error;
        try {
          dm.setConfig();
        } catch (_error) {
          err = _error;
          error = err;
        }
        return assert.instanceOf(error, Error);
      });
      return test("Should throw Error when configuring twice", function() {
        var err, error;
        dm.setConfig(config);
        try {
          dm.setConfig(randomPrimitivesHash());
        } catch (_error) {
          err = _error;
          error = err;
        }
        return assert.instanceOf(error, Error);
      });
    });
    suite("#getConfig", function() {
      var config, dm, parameters;
      dm = null;
      config = null;
      parameters = null;
      setup(function() {
        dm = new DM;
        config = randomPrimitivesHash();
        return parameters = randomPrimitivesHash();
      });
      test("Should return not exact copy of config", function() {
        var copy;
        dm.setConfig(config, parameters);
        copy = dm.getConfig();
        assert.notEqual(config, copy, "Must not be equal objects");
        _.each(copy, function(value, key) {
          return assert.strictEqual(config[key], value, "Config values must be strict equal");
        });
        return _.each(parameters, function(value, key) {
          return assert.strictEqual(value, dm.getParameter(key), "Parameters values must be strict equal");
        });
      });
      return test("Should return value by key", function() {
        var key, result, value;
        key = chance.word();
        config[key] = value = randomPrimitivesHash();
        dm.setConfig(config);
        result = dm.getConfig(key);
        assert.notEqual(result, value, "Must not be equal objects");
        return _.each(result, function(val, key) {
          return assert.strictEqual(value[key], val, "Config values must be strict equal");
        });
      });
    });
    suite("#setParameter", function() {
      var dm, parameters;
      dm = null;
      parameters = null;
      setup(function() {
        dm = new DM;
        return parameters = randomPrimitivesHash();
      });
      test("Should set parameter", function() {
        _.each(parameters, function(value, key) {
          return dm.setParameter(key, value);
        });
        return _.each(parameters, function(value, key) {
          return assert.strictEqual(value, dm.getParameter(key), "Parameters values must be strict equal");
        });
      });
      return test("Should throw Error when parameter is already set", function() {
        var err, error, key, value;
        key = chance.word();
        value = chance.word();
        dm.setParameter(key, value);
        try {
          dm.setParameter(key, chance.word());
        } catch (_error) {
          err = _error;
          error = err;
        }
        return assert.instanceOf(error, Error);
      });
    });
    suite("#getParameter", function() {
      var dm, parameters;
      dm = null;
      parameters = null;
      setup(function() {
        dm = new DM;
        return parameters = randomPrimitivesHash();
      });
      test("Should get parameter", function() {
        _.each(parameters, function(value, key) {
          return dm.setParameter(key, value);
        });
        return _.each(parameters, function(value, key) {
          return assert.strictEqual(value, dm.getParameter(key), "Parameters values must be strict equal");
        });
      });
      return test("Should return null, when parameter is not set", function() {
        var value;
        value = dm.getParameter(chance.word());
        return assert.isNull(value);
      });
    });
    suite("#setAsync", function() {
      var async, dm;
      dm = null;
      async = null;
      setup(function() {
        dm = new DM;
        return async = new Async;
      });
      test("Should accept adapter of expected interface", function() {
        var err, error;
        try {
          dm.setAsync(async);
        } catch (_error) {
          err = _error;
          error = err;
        }
        return assert.isUndefined(error);
      });
      test("Should throw an error when given adapter is not of expected interface", function() {
        var err, error;
        try {
          dm.setAsync(new Object);
        } catch (_error) {
          err = _error;
          error = err;
        }
        return assert.instanceOf(error, Error);
      });
      return test("Should throw an error when nothing is given", function() {
        var err, error;
        try {
          dm.setAsync();
        } catch (_error) {
          err = _error;
          error = err;
        }
        return assert.instanceOf(error, Error);
      });
    });
    suite("#setLoader", function() {
      var dm, loader;
      dm = null;
      loader = null;
      setup(function() {
        dm = new DM;
        return loader = new Loader;
      });
      test("Should accept adapter of expected interface", function() {
        var err, error;
        try {
          dm.setLoader(loader);
        } catch (_error) {
          err = _error;
          error = err;
        }
        return assert.isUndefined(error);
      });
      test("Should throw an error when given adapter is not of expected interface", function() {
        var err, error;
        try {
          dm.setLoader(new Object);
        } catch (_error) {
          err = _error;
          error = err;
        }
        return assert.instanceOf(error, Error);
      });
      return test("Should throw an error when nothing is given", function() {
        var err, error;
        try {
          dm.setLoader();
        } catch (_error) {
          err = _error;
          error = err;
        }
        return assert.instanceOf(error, Error);
      });
    });
    suite("#parseString", function() {
      var async, dm, loader;
      dm = null;
      async = null;
      loader = null;
      setup(function() {
        dm = new DM;
        async = new Async;
        loader = new Loader;
        dm.setAsync(async);
        return dm.setLoader(loader.setAsync(async));
      });
      test("Should throw an error when nothing is given", function() {
        var error;
        sinon.stub(async, "reject", function(err) {
          return err;
        });
        error = dm.parseString();
        sinon.assert.calledOnce(async.reject);
        return assert.instanceOf(error, Error);
      });
      test("Should parse as self link", function(done) {
        sinon.stub(async, "resolve", RSVP.resolve);
        return dm.parseString(DM.SELF).then(function(result) {
          var err, error;
          try {
            assert.strictEqual(result, dm);
          } catch (_error) {
            err = _error;
            error = err;
          }
          return done(error);
        });
      });
      test("Should parse as parameter", function() {
        var key, mock, result, string, value, wrap;
        key = chance.word();
        wrap = chance.word();
        string = "%" + key + "%";
        value = chance.word();
        sinon.stub(async, "resolve", function(value) {
          return value;
        });
        mock = sinon.mock(dm).expects("getParameter").on(dm).once().withExactArgs(key).returns(value);
        result = dm.parseString(string);
        mock.verify();
        return assert.strictEqual(result, value);
      });
      test("Should parse as parameters", function() {
        var expect, getParameterStub, keys, links, result, string, values, wrap;
        keys = Array.prototype.slice.apply(new Int8Array(5)).map(function() {
          return chance.word();
        });
        links = keys.map(function(key) {
          return ["%{", key, "}"].join('');
        });
        wrap = chance.word();
        string = wrap + links.join(wrap) + wrap;
        values = keys.map(function() {
          return chance.word();
        });
        expect = wrap + values.join(wrap) + wrap;
        sinon.stub(async, "resolve", function(value) {
          return value;
        });
        getParameterStub = sinon.stub(dm, "getParameter", function(key) {
          return values[keys.indexOf(key)];
        });
        result = dm.parseString(string);
        assert.strictEqual(getParameterStub.callCount, keys.length, "#getParameterStub is not called " + keys.length + " times");
        keys.forEach(function(key, index) {
          return assert.isTrue(getParameterStub.getCall(index).calledWith(key), "#getParameterStub call #" + index + " is not called with '" + key + "'");
        });
        return assert.strictEqual(result, expect);
      });
      test("Should parse as service without anything", function(done) {
        var mock, name, string, value;
        name = chance.word();
        string = "@" + name;
        value = chance.word();
        sinon.stub(async, "resolve", RSVP.resolve);
        sinon.stub(async, "all", RSVP.all);
        mock = sinon.mock(dm).expects("get").on(dm).once().withExactArgs(name, {
          property: void 0,
          "arguments": void 0
        }).returns(value);
        return dm.parseString(string).then(function(result) {
          var err, error;
          try {
            mock.verify();
            assert.strictEqual(result, value);
          } catch (_error) {
            err = _error;
            error = err;
          }
          return done(error);
        })["catch"](done);
      });
      test("Should parse as service's method", function(done) {
        var handler, mock, name, string, value;
        name = chance.word();
        handler = chance.word();
        string = "@" + name + ":" + handler;
        value = chance.word();
        sinon.stub(async, "resolve", RSVP.resolve);
        sinon.stub(async, "all", RSVP.all);
        mock = sinon.mock(dm).expects("get").on(dm).once().withExactArgs(name, {
          property: handler,
          "arguments": void 0
        }).returns(value);
        return dm.parseString(string).then(function(result) {
          var err, error;
          try {
            mock.verify();
            assert.strictEqual(result, value);
          } catch (_error) {
            err = _error;
            error = err;
          }
          return done(error);
        })["catch"](done);
      });
      test("Should parse as call of service's method", function(done) {
        var handler, mock, name, string, value;
        name = chance.word();
        handler = chance.word();
        string = "@" + name + ":" + handler + "[]";
        value = chance.word();
        sinon.stub(async, "resolve", RSVP.resolve);
        sinon.stub(async, "reject", RSVP.resolve);
        sinon.stub(async, "all", RSVP.all);
        mock = sinon.mock(dm).expects("get").on(dm).once().withExactArgs(name, {
          property: handler,
          "arguments": []
        }).returns(value);
        return dm.parseString(string).then(function(result) {
          var err, error;
          try {
            mock.verify();
            assert.strictEqual(result, value);
          } catch (_error) {
            err = _error;
            error = err;
          }
          return done(error);
        })["catch"](done);
      });
      test("Should parse as call of service's method with arguments", function(done) {
        var args, getStub, handler, int, name, object, parameter, parameterValue, parseStringSpy, service, serviceValue, string, value, word;
        name = chance.word();
        handler = chance.word();
        word = chance.word();
        int = chance.integer();
        object = {
          a: chance.integer(),
          b: chance.word()
        };
        parameter = chance.word();
        parameterValue = chance.integer();
        service = chance.word();
        serviceValue = chance.word();
        args = [word, int, object, "%" + parameter + "%", "%{" + parameter + "}", "@" + service];
        string = "@" + name + ":" + handler + JSON.stringify(args);
        value = chance.word();
        sinon.stub(async, "resolve", RSVP.resolve);
        sinon.stub(async, "all", RSVP.all);
        sinon.stub(dm, "getParameter", function(key) {
          return parameterValue;
        });
        parseStringSpy = sinon.spy(dm, "parseString");
        getStub = sinon.stub(dm, "get", function(key, options) {
          if (key === name) {
            return value;
          }
          if (key === service) {
            return serviceValue;
          }
        });
        return dm.parseString(string).then(function(result) {
          var err, error;
          try {
            assert.isTrue(getStub.calledTwice, "#get called twice");
            assert.isTrue(getStub.firstCall.calledWith(service), "#get first time called with service from arguments");
            assert.isTrue(getStub.secondCall.calledWithExactly(name, {
              property: handler,
              "arguments": [word, int, object, parameterValue, parameterValue.toString(), serviceValue]
            }), "#get second time called with methods service, name of method, and its arguments");
            assert.strictEqual(result, value);
          } catch (_error) {
            err = _error;
            error = err;
          }
          return done(error);
        })["catch"](done);
      });
      test("Should parse as resource with handler", function(done) {
        var getResourceStub, handled, handler, parseStringSpy, path, string;
        path = chance.word();
        handler = chance.word();
        string = "#" + handler + "!" + path + "#";
        handled = chance.word();
        sinon.stub(async, "resolve", RSVP.resolve);
        sinon.stub(async, "all", RSVP.all);
        getResourceStub = sinon.stub(dm, "getResource", function(path, handler) {
          return RSVP.resolve(handled);
        });
        parseStringSpy = sinon.spy(dm, "parseString");
        return dm.parseString(string).then(function(result) {
          var err, error;
          try {
            assert.isTrue(getResourceStub.alwaysCalledOn(dm), "#getResource is not called on DM");
            assert.isTrue(getResourceStub.calledOnce, "#getResource is not called once");
            assert.isTrue(getResourceStub.calledWithExactly(path, handler), "#getResource is not called once exactly with path and handler");
            assert.isTrue(parseStringSpy.calledThrice, "#parseString is not called thrice");
            assert.isTrue(parseStringSpy.alwaysCalledOn(dm), "#parseString is not always called on DM");
            assert.isTrue(parseStringSpy.getCall(1).calledWithExactly(path), "#parseString first call is not called on path");
            assert.isTrue(parseStringSpy.getCall(2).calledWithExactly(handler), "#parseString second call is not called on handler");
            assert.strictEqual(result, handled);
          } catch (_error) {
            err = _error;
            error = err;
          }
          return done(error);
        });
      });
      return test("Should parse as resource without handler", function(done) {
        var getResourceStub, parseStringSpy, path, string, value;
        path = chance.word();
        string = "#" + path + "#";
        value = chance.word();
        sinon.stub(async, "resolve", RSVP.resolve);
        sinon.stub(async, "all", RSVP.all);
        getResourceStub = sinon.stub(dm, "getResource", function() {
          return RSVP.resolve(value);
        });
        parseStringSpy = sinon.spy(dm, "parseString");
        return dm.parseString(string).then(function(result) {
          var err, error;
          try {
            assert.isTrue(getResourceStub.alwaysCalledOn(dm), "#getResource is not called on DM");
            assert.isTrue(getResourceStub.calledOnce, "#getResource is not called once");
            assert.isTrue(getResourceStub.calledWithExactly(path), "#getResource is not called once exactly with path and handler");
            assert.isTrue(parseStringSpy.calledTwice, "#parseString is not called twice");
            assert.isTrue(parseStringSpy.alwaysCalledOn(dm), "#parseString is not always called on DM");
            assert.isTrue(parseStringSpy.getCall(1).calledWithExactly(path), "#parseString first call is not called on path");
            assert.strictEqual(result, value);
          } catch (_error) {
            err = _error;
            error = err;
          }
          return done(error);
        });
      });
    });
    suite("#parseObject", function() {
      var async, dm, loader;
      dm = null;
      async = null;
      loader = null;
      setup(function() {
        dm = new DM;
        async = new Async;
        loader = new Loader;
        sinon.stub(async, "all", RSVP.all);
        sinon.stub(async, "resolve", RSVP.resolve);
        dm.setAsync(async);
        return dm.setLoader(loader.setAsync(async));
      });
      test("Should fall in recursion with objects", function(done) {
        var config, key, nested, object, parseObjectSpy, string;
        key = chance.word();
        nested = chance.word();
        string = chance.word();
        object = {};
        object[key] = string;
        config = {};
        config[nested] = object;
        parseObjectSpy = sinon.spy(dm, "parseObject");
        sinon.stub(dm, "parseString", function(string) {
          return RSVP.resolve(string);
        });
        return dm.parseObject(config).then(function(result) {
          var err, error;
          try {
            assert.isTrue(parseObjectSpy.calledTwice, "#parse is not called twice");
            assert.isTrue(parseObjectSpy.secondCall.calledWith(object), "#parse is not called with nested object");
            assert.isTrue(parseObjectSpy.alwaysCalledOn(dm), "#parse is not called always on DM");
            assert.property(result, nested);
            assert.isObject(result[nested]);
            assert.property(result[nested], key);
          } catch (_error) {
            err = _error;
            error = err;
          }
          return done(error);
        });
      });
      test("Should fall in recursion with arrays", function(done) {
        var array, config, nested, parseObjectSpy, string;
        nested = chance.word();
        string = chance.word();
        array = [];
        array.push(string);
        config = {};
        config[nested] = array;
        parseObjectSpy = sinon.spy(dm, "parseObject");
        sinon.stub(dm, "parseString", function(string) {
          return RSVP.resolve(string);
        });
        return dm.parseObject(config).then(function(result) {
          var err, error;
          try {
            assert.isTrue(parseObjectSpy.calledTwice, "#parse is not called twice");
            assert.isTrue(parseObjectSpy.secondCall.calledWith(array), "#parse is not called with nested array");
            assert.isTrue(parseObjectSpy.alwaysCalledOn(dm), "#parse is not called always on DM");
            assert.property(result, nested);
            assert.isArray(result[nested]);
            assert.strictEqual(result[nested].length, array.length);
          } catch (_error) {
            err = _error;
            error = err;
          }
          return done(error);
        });
      });
      return test("Should return escaped value", function(done) {
        var config, key, nested, object, parseObjectSpy, string;
        key = chance.word();
        nested = chance.word();
        string = chance.word();
        object = {};
        object[key] = string;
        config = {};
        config[nested] = object;
        parseObjectSpy = sinon.spy(dm, "parseObject");
        return dm.parseObject(DM.escape(config)).then(function(result) {
          var err, error;
          try {
            assert.isTrue(parseObjectSpy.calledOnce, "#parse is not called once");
            assert.strictEqual(result, config);
            assert.property(result, nested);
            assert.isObject(result[nested]);
          } catch (_error) {
            err = _error;
            error = err;
          }
          return done(error);
        });
      });
    });
    suite("#parse", function() {
      var async, dm, loader;
      dm = null;
      async = null;
      loader = null;
      setup(function() {
        dm = new DM;
        async = new Async;
        loader = new Loader;
        sinon.stub(async, "all", RSVP.all);
        sinon.stub(async, "resolve", RSVP.resolve);
        dm.setAsync(async);
        return dm.setLoader(loader.setAsync(async));
      });
      test("Should parse string", function(done) {
        var parseStringSpy;
        parseStringSpy = sinon.stub(dm, "parseString", RSVP.resolve);
        return dm.parse(chance.word()).then(function() {
          var err, error;
          try {
            assert.isTrue(parseStringSpy.calledOnce, "#parseString is not called once");
          } catch (_error) {
            err = _error;
            error = err;
          }
          return done(error);
        });
      });
      test("Should parse object", function(done) {
        var object, parseObjectSpy;
        object = {};
        parseObjectSpy = sinon.stub(dm, "parseObject", RSVP.resolve);
        return dm.parse(object).then(function() {
          var err, error;
          try {
            assert.isTrue(parseObjectSpy.calledOnce, "#parseObject is not called once");
          } catch (_error) {
            err = _error;
            error = err;
          }
          return done(error);
        });
      });
      test("Should parse array", function(done) {
        var array, parseObjectSpy;
        array = [];
        parseObjectSpy = sinon.stub(dm, "parseObject", RSVP.resolve);
        return dm.parse(array).then(function() {
          var err, error;
          try {
            assert.isTrue(parseObjectSpy.calledOnce, "#parseObject is not called once");
          } catch (_error) {
            err = _error;
            error = err;
          }
          return done(error);
        });
      });
      test("Should not parse numbers", function(done) {
        var number, parseObjectSpy, parseStringSpy;
        number = chance.integer();
        parseObjectSpy = sinon.stub(dm, "parseObject", RSVP.resolve);
        parseStringSpy = sinon.stub(dm, "parseString", RSVP.resolve);
        return dm.parse(number).then(function(result) {
          var err, error;
          try {
            assert.strictEqual(result, number);
            assert.isFalse(parseObjectSpy.called, "#parseObject is called");
            assert.isFalse(parseStringSpy.called, "#parseString is called");
          } catch (_error) {
            err = _error;
            error = err;
          }
          return done(error);
        });
      });
      return test("Should not parse any other objects from Array, String, Object", function(done) {
        var parseObjectSpy, parseStringSpy, value;
        value = new Date();
        parseObjectSpy = sinon.stub(dm, "parseObject", RSVP.resolve);
        parseStringSpy = sinon.stub(dm, "parseString", RSVP.resolve);
        return dm.parse(value).then(function(result) {
          var err, error;
          try {
            assert.strictEqual(result, value);
            assert.isFalse(parseObjectSpy.called, "#parseObject is called");
            assert.isFalse(parseStringSpy.called, "#parseString is called");
          } catch (_error) {
            err = _error;
            error = err;
          }
          return done(error);
        });
      });
    });
    suite("#getResource", function() {
      var async, dm, loader;
      dm = null;
      async = null;
      loader = null;
      setup(function() {
        dm = new DM;
        async = new Async;
        loader = new Loader;
        sinon.stub(async, "all", function(promises) {
          return RSVP.all(promises);
        });
        sinon.stub(async, "resolve", function(value) {
          return RSVP.resolve(value);
        });
        sinon.stub(async, "reject", function(err) {
          return RSVP.reject(err);
        });
        dm.setAsync(async);
        return dm.setLoader(loader.setAsync(async));
      });
      test("Should call #read without handler in options if it function", function(done) {
        var handler, path, readStub, resource;
        path = chance.word();
        resource = chance.word();
        handler = function() {};
        readStub = sinon.stub(loader, "read", function(path) {
          return RSVP.resolve(resource);
        });
        return dm.getResource(path, handler).then(function() {
          var err, error, options;
          try {
            options = readStub.getCall(0).args[1];
            assert.isObject(options);
            assert.isUndefined(options.handler, "handler is passed in options");
          } catch (_error) {
            err = _error;
            error = err;
          }
          return done(error);
        })["catch"](done);
      });
      test("Should call #read with handler in options if it is not a function", function(done) {
        var handler, path, readStub, resource;
        path = chance.word();
        resource = chance.word();
        handler = chance.word();
        readStub = sinon.stub(loader, "read", function(path) {
          return RSVP.resolve(resource);
        });
        return dm.getResource(path, handler).then(function() {
          var err, error, options;
          try {
            options = readStub.getCall(0).args[1];
            assert.isObject(options);
            assert.isDefined(options.handler, "handler is not passed in options");
            assert.strictEqual(handler, options.handler, "handler is not the same as expected");
          } catch (_error) {
            err = _error;
            error = err;
          }
          return done(error);
        })["catch"](done);
      });
      test("Should pass #read result directly in #handler", function(done) {
        var handler, path, resource;
        path = chance.word();
        resource = chance.word();
        handler = sinon.spy();
        sinon.stub(loader, "read", function(path) {
          return RSVP.resolve(resource);
        });
        return dm.getResource(path, handler).then(function() {
          var err, error;
          try {
            assert.isTrue(handler.calledOnce, "handler function is not called once");
            assert.isTrue(handler.calledWith(resource), "handler function is not called with result of require");
          } catch (_error) {
            err = _error;
            error = err;
          }
          return done(error);
        })["catch"](done);
      });
      test("Should return #handler result", function(done) {
        var handled, handler, path;
        path = chance.word();
        handled = chance.word();
        handler = sinon.spy(function() {
          return handled;
        });
        sinon.stub(loader, "read", function(path) {
          return RSVP.resolve();
        });
        return dm.getResource(path, handler).then(function(result) {
          var err, error;
          try {
            assert.strictEqual(result, handled, "#getResource result is not strict equal to expected");
          } catch (_error) {
            err = _error;
            error = err;
          }
          return done(error);
        })["catch"](done);
      });
      test("Should call #read for path", function(done) {
        var handler, path, readStub;
        path = chance.word();
        handler = function() {};
        readStub = sinon.stub(loader, "read", function(path) {
          return RSVP.resolve();
        });
        return dm.getResource(path, handler).then(function(result) {
          var err, error;
          try {
            assert.isTrue(readStub.calledOnce, "#read is not called once");
            assert.isTrue(readStub.calledWith(path), "#read is not called with path");
          } catch (_error) {
            err = _error;
            error = err;
          }
          return done(error);
        });
      });
      test("Should call #read for path if handler is not given", function(done) {
        var path, readStub;
        path = chance.word();
        readStub = sinon.stub(loader, "read", function(path) {
          return RSVP.resolve();
        });
        return dm.getResource(path).then(function(result) {
          var err, error;
          try {
            assert.isTrue(readStub.calledOnce, "#read is not called once");
            assert.isTrue(readStub.calledWith(path), "#read is not called with path");
          } catch (_error) {
            err = _error;
            error = err;
          }
          return done(error);
        });
      });
      return test("Should throw an error if path is not string", function(done) {
        var handler, path, readStub;
        path = null;
        handler = function() {};
        readStub = sinon.stub(loader, "read", function(path) {
          return RSVP.resolve();
        });
        return dm.getResource(path, handler).then(function(result) {
          return done(new Error("#getResource is successfully resolved instead"));
        })["catch"](function(error) {
          var err, _error;
          try {
            assert.isTrue(readStub.callCount === 0, "#read was called");
            assert.instanceOf(error, Error);
          } catch (_error) {
            err = _error;
            _error = err;
          }
          return done(_error);
        });
      });
    });
    suite("#build", function() {
      var argA, argB, argC, args, calls, config, constructor, dm, key, path, propA, propB, propC, properties, spy, spyA, spyB, spyC;
      dm = null;
      key = null;
      path = null;
      constructor = null;
      spy = null;
      calls = null;
      spyA = null;
      spyB = null;
      spyC = null;
      args = null;
      argA = null;
      argB = null;
      argC = null;
      properties = null;
      propA = null;
      propB = null;
      propC = null;
      config = null;
      setup(function() {
        var async, loader;
        dm = new DM;
        async = new Async;
        loader = new Loader;
        key = chance.word();
        path = chance.word();
        constructor = sinon.spy();
        constructor.prototype.spy = spy = sinon.spy();
        args = [argA = chance.word(), argB = chance.integer(), argC = {}];
        calls = [["spy", [spyA = chance.word(), spyB = chance.integer(), spyC = {}]]];
        properties = {
          a: propA = chance.word(),
          b: propB = chance.integer(),
          c: propC = {
            a: 1
          }
        };
        config = {
          path: path,
          constructor: constructor,
          calls: calls,
          properties: properties,
          "arguments": args
        };
        sinon.stub(async, "all", function(promises) {
          return RSVP.all(promises);
        });
        sinon.stub(async, "resolve", function(value) {
          return RSVP.resolve(value);
        });
        sinon.stub(async, "reject", function(err) {
          return RSVP.reject(err);
        });
        sinon.stub(loader, "require", function(_path) {
          if (_path === path) {
            return RSVP.resolve(constructor);
          }
        });
        dm.setAsync(async);
        return dm.setLoader(loader.setAsync(async));
      });
      test("Should instantiate object of given constructor, with given args, calls and setting properties", function(done) {
        return dm.build(config).then(function(service) {
          var err, error;
          try {
            assert.isTrue(constructor.calledOnce, "Constructor was not called once");
            assert.isTrue(constructor.calledWithExactly(argA, argB, argC), "Constructor was not called exactly with given arguments");
            assert.instanceOf(service, constructor);
            assert.isTrue(spy.calledOnce, "Instance call was not called once");
            assert.isTrue(spy.calledWithExactly(spyA, spyB, spyC), "Instance call was not called exactly with given arguments");
            assert.propertyVal(service, "a", propA);
            assert.propertyVal(service, "b", propB);
            assert.property(service, "c");
            _.each(service.c, function(value, key) {
              return assert.strictEqual(propC[key], value, "Instance sub properties values must be strict equal");
            });
          } catch (_error) {
            err = _error;
            error = err;
          }
          return done(error);
        })["catch"](done);
      });
      test("Should call custom factory function with constructor, args, calls and properties", function(done) {
        var factory;
        config.factory = factory = sinon.spy();
        return dm.build(config).then(function() {
          var err, error;
          try {
            assert.isTrue(factory.calledOnce, "Custom factory is not called once");
            assert.isTrue(factory.calledWithExactly({
              constructor: constructor,
              calls: calls,
              properties: properties,
              "arguments": args
            }), "Custom factory is not called with definition");
          } catch (_error) {
            err = _error;
            error = err;
          }
          return done(error);
        })["catch"](done);
      });
      return test("Should call custom factory object#factory with constructor, args, calls and properties", function(done) {
        var factory;
        config.factory = factory = {
          factory: sinon.spy()
        };
        return dm.build(config).then(function() {
          var err, error;
          try {
            assert.isTrue(factory.factory.calledOnce, "Custom factory is not called once");
            assert.isTrue(factory.factory.calledWithExactly({
              constructor: constructor,
              calls: calls,
              properties: properties,
              "arguments": args
            }), "Custom factory is not called with definition");
          } catch (_error) {
            err = _error;
            error = err;
          }
          return done(error);
        })["catch"](done);
      });
    });
    suite("#set", function() {
      var async, config, dm, loader;
      dm = null;
      async = null;
      loader = null;
      config = null;
      setup(function() {
        dm = new DM;
        async = new Async;
        loader = new Loader;
        config = {
          "synth": {
            synthetic: true
          },
          "not": {
            path: "/some/path"
          }
        };
        sinon.stub(async, "all", function(promises) {
          return RSVP.all(promises);
        });
        sinon.stub(async, "resolve", function(value) {
          return RSVP.resolve(value);
        });
        sinon.stub(async, "reject", function(err) {
          return RSVP.reject(err);
        });
        sinon.stub(loader, "require", function() {
          return RSVP.resolve(function() {});
        });
        dm.setAsync(async);
        return dm.setLoader(loader.setAsync(async));
      });
      test("Should not inject service if it is not synthetic", function() {
        var err, error;
        dm.setConfig(config);
        try {
          dm.set("not", new Object);
        } catch (_error) {
          err = _error;
          error = err;
        }
        return assert.instanceOf(error, Error);
      });
      test("Should not inject service if it is not present in config", function() {
        var err, error;
        dm.setConfig(config);
        try {
          dm.set(chance.word(), new Object);
        } catch (_error) {
          err = _error;
          error = err;
        }
        return assert.instanceOf(error, Error);
      });
      return test("Should inject service if it is synthetic", function() {
        var err, error, service;
        dm.setConfig(config);
        service = new Object;
        try {
          dm.set("synth", service);
        } catch (_error) {
          err = _error;
          error = err;
        }
        assert.notInstanceOf(error, Error);
        return assert.isTrue(dm.initialized("synth"));
      });
    });
    suite("#initialized", function() {
      var async, config, dm, loader;
      dm = null;
      async = null;
      loader = null;
      config = null;
      setup(function() {
        dm = new DM;
        async = new Async;
        loader = new Loader;
        config = {
          "service": {
            path: "/some/path"
          }
        };
        sinon.stub(async, "all", function(promises) {
          return RSVP.all(promises);
        });
        sinon.stub(async, "resolve", function(value) {
          return RSVP.resolve(value);
        });
        sinon.stub(async, "reject", function(err) {
          return RSVP.reject(err);
        });
        sinon.stub(loader, "require", function() {
          return RSVP.resolve(function() {});
        });
        dm.setAsync(async);
        return dm.setLoader(loader.setAsync(async));
      });
      test("Should return false for not initialized service", function() {
        dm.setConfig(config);
        return assert.isFalse(dm.initialized("service"));
      });
      return test("Should return true for initialized service", function(done) {
        dm.setConfig(config);
        return dm.get("service").then(function() {
          return dm.initialized("service");
        }).then(function(isInitialized) {
          var err, error;
          try {
            assert.isTrue(isInitialized);
          } catch (_error) {
            err = _error;
            error = err;
          }
          return done(error);
        })["catch"](done);
      });
    });
    suite("#has", function() {
      var async, config, dm, loader;
      dm = null;
      async = null;
      loader = null;
      config = null;
      setup(function() {
        dm = new DM;
        async = new Async;
        loader = new Loader;
        return config = {
          "service": {
            path: "/some/path"
          }
        };
      });
      test("Should return false for not configured service", function() {
        dm.setConfig(config);
        return assert.isFalse(dm.has(chance.word()));
      });
      return test("Should return true for configured service", function() {
        dm.setConfig(config);
        return assert.isTrue(dm.has("service"));
      });
    });
    suite("#get", function() {
      var argA, argB, argC, args, calls, config, constructor, dm, key, path, propA, propB, propC, properties, spy, spyA, spyB, spyC;
      dm = null;
      key = null;
      path = null;
      constructor = null;
      spy = null;
      calls = null;
      spyA = null;
      spyB = null;
      spyC = null;
      args = null;
      argA = null;
      argB = null;
      argC = null;
      properties = null;
      propA = null;
      propB = null;
      propC = null;
      config = null;
      setup(function() {
        var async, loader;
        key = chance.word();
        path = chance.word();
        constructor = sinon.spy();
        constructor.prototype.spy = spy = sinon.spy();
        args = [argA = chance.word(), argB = chance.integer(), argC = {}];
        calls = [["spy", [spyA = chance.word(), spyB = chance.integer(), spyC = {}]]];
        properties = {
          a: propA = chance.word(),
          b: propB = chance.integer(),
          c: propC = {
            a: 1
          }
        };
        config = {
          synth: {
            synthetic: true
          }
        };
        config[key] = {
          path: path,
          constructor: constructor,
          calls: calls,
          properties: properties,
          "arguments": args
        };
        dm = new DM;
        async = new Async;
        loader = new Loader;
        sinon.stub(async, "all", function(promises) {
          return RSVP.all(promises);
        });
        sinon.stub(async, "resolve", function(value) {
          return RSVP.resolve(value);
        });
        sinon.stub(async, "reject", function(err) {
          return RSVP.reject(err);
        });
        dm.setAsync(async);
        return dm.setLoader(loader.setAsync(async));
      });
      test("Should create just one instance of service if share is true", function(done) {
        var buildStub, service;
        config[key].share = true;
        dm.setConfig(config);
        service = new Object;
        buildStub = sinon.stub(dm, "build", function() {
          return RSVP.resolve(service);
        });
        return dm.get(key).then(function(serviceA) {
          return dm.get(key).then(function(serviceB) {
            var err, error;
            try {
              assert.isTrue(buildStub.calledOnce, "#build not called once");
              assert.isTrue(buildStub.calledWithExactly(config[key]), "#build is not called with config");
            } catch (_error) {
              err = _error;
              error = err;
            }
            return done(error);
          })["catch"](done);
        });
      });
      test("Should create multiple instance of service if share is false", function(done) {
        var buildStub, service;
        config[key].share = false;
        dm.setConfig(config);
        service = new Object;
        buildStub = sinon.stub(dm, "build", function() {
          return RSVP.resolve(service);
        });
        return dm.get(key).then(function(serviceA) {
          return dm.get(key).then(function(serviceB) {
            var err, error;
            try {
              assert.isTrue(buildStub.calledTwice, "#build not called twice");
              assert.isTrue(buildStub.calledWithExactly(config[key]), "#build is not called with config");
            } catch (_error) {
              err = _error;
              error = err;
            }
            return done(error);
          })["catch"](done);
        });
      });
      test("Should return injected synthetic service", function(done) {
        var service;
        dm.setConfig(config);
        service = new Object;
        dm.set("synth", service);
        return dm.get("synth").then(function(value) {
          var err, error;
          try {
            assert.strictEqual(value, service);
          } catch (_error) {
            err = _error;
            error = err;
          }
          return done(error);
        })["catch"](done);
      });
      test("Should return aliased service", function(done) {
        var getStub, realGet;
        dm.setConfig({
          aliased: {
            alias: "some_alias"
          }
        });
        realGet = dm.get;
        getStub = sinon.stub(dm, "get", function(key) {
          if (key === "aliased") {
            return realGet.call(dm, key);
          }
          return RSVP.resolve();
        });
        sinon.stub(dm, "has").withArgs("some_alias").returns(true);
        return dm.get("aliased").then(function() {
          var err, error;
          try {
            assert.isTrue(getStub.calledTwice, "#get called twice");
            assert.isTrue(getStub.firstCall.calledWith("aliased"));
            assert.isTrue(getStub.secondCall.calledWith("some_alias"));
          } catch (_error) {
            err = _error;
            error = err;
          }
          return done(error);
        })["catch"](done);
      });
      test("Should return property of service", function(done) {
        var prop, service, val;
        dm.setConfig(config);
        service = new Object;
        prop = chance.word();
        val = chance.integer();
        service[prop] = val;
        sinon.stub(dm, "build", function() {
          return RSVP.resolve(service);
        });
        return dm.get(key, {
          property: prop
        }).then(function(value) {
          var err, error;
          try {
            assert.strictEqual(value, val);
          } catch (_error) {
            err = _error;
            error = err;
          }
          return done(error);
        })["catch"](done);
      });
      test("Should return method of service, contexted in service", function(done) {
        var prop, service, val;
        dm.setConfig(config);
        service = new Object;
        prop = chance.word();
        val = function() {
          return assert.strictEqual(this, service, "Method not contexted in service");
        };
        service[prop] = val;
        sinon.stub(dm, "build", function() {
          return RSVP.resolve(service);
        });
        return dm.get(key, {
          property: prop
        }).then(function(value) {
          var err, error;
          try {
            value();
          } catch (_error) {
            err = _error;
            error = err;
          }
          return done(error);
        })["catch"](done);
      });
      return test("Should return result of service's method call", function(done) {
        var prop, result, service, val;
        dm.setConfig(config);
        service = new Object;
        prop = chance.word();
        args = [argA = chance.word(), argB = chance.integer(), argC = {}];
        result = chance.word();
        val = function() {
          assert.strictEqual(this, service, "Method not contexted in service");
          return result;
        };
        service[prop] = val;
        sinon.stub(dm, "build", function() {
          return RSVP.resolve(service);
        });
        return dm.get(key, {
          property: prop,
          "arguments": args
        }).then(function(value) {
          var err, error;
          try {
            assert.strictEqual(value, result);
          } catch (_error) {
            err = _error;
            error = err;
          }
          return done(error);
        })["catch"](done);
      });
    });
    suite("#escape", function() {
      return test("Should return escaped value", function() {
        var escaped, value;
        value = chance.word();
        escaped = DM.escape(value);
        return assert.isObject(escaped);
      });
    });
    suite("#unEscape", function() {
      test("Should return unescaped value", function() {
        var escaped, unescaped, value;
        value = chance.word();
        escaped = DM.escape(value);
        unescaped = DM.unEscape(escaped);
        return assert.strictEqual(unescaped, value);
      });
      return test("Should return null if it not escaped", function() {
        var unescaped, value;
        value = chance.word();
        unescaped = DM.unEscape(value);
        return assert.isNull(unescaped);
      });
    });
    return suite("#extend", function() {
      return test("Should return proper prototyped object", function() {
        var Child, child, methodProtoName, methodProtoValue, methodStaticName, methodStaticValue, protos, statics;
        protos = {};
        methodProtoName = chance.word();
        methodProtoValue = function() {};
        protos[methodProtoName] = methodProtoValue;
        statics = {};
        methodStaticName = chance.word();
        methodStaticValue = chance.word();
        statics[methodStaticName] = methodStaticValue;
        Child = DM.extend(protos, statics);
        child = new Child();
        assert.instanceOf(child, DM);
        return assert.propertyVal(Child, methodStaticName, methodStaticValue);
      });
    });
  });

}).call(this);
