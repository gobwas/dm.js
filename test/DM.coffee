_      = require('lodash');
chance = require('chance');
sinon  = require('sinon');
chai   = require('chai');
DM     = require('./dist/dm.js');
Loader = require('./dist/dm/adapter/loader');
Async  = require('./dist/dm/adapter/async');
RSVP   = require('rsvp');

chance = new chance;
assert = chai.assert;



# ------------------
# Tests suite for dm
# ------------------

suite "dm.js", ->



  # Setup
  # -----

  randomPrimitivesHash = () ->
    _.reduce(new Array(chance.natural(min: 10, max: 100)), (rnd) ->
      rnd[chance.word()] = chance.integer();
      rnd[chance.word()] = chance.string();
      rnd[chance.word()] = chance.bool();
      rnd;
    ,{});

  setup ->
    # ...



    # setConfig
    # ---------

  suite "#setConfig", ->

    dm         = null;
    config     = null;
    parameters = null;

    setup ->
      dm         = new DM;
      config     = randomPrimitivesHash();
      parameters = randomPrimitivesHash();

    # ================

    test "Should set config without errors", ->
      try
        dm.setConfig(config, parameters);
      catch err
        error = err

      assert.isUndefined error

    # ================

    test "Should throw Error if nothing given", ->
      try
        dm.setConfig();
      catch err
        error = err

      assert.instanceOf error, Error;

    # ================

    test "Should throw Error when configuring twice", ->
      dm.setConfig(config);

      try
        dm.setConfig(randomPrimitivesHash());
      catch err
        error = err

      assert.instanceOf error, Error;



  # getConfig
  # ---------

  suite "#getConfig", ->

    dm         = null;
    config     = null;
    parameters = null;

    setup ->
      dm         = new DM;
      config     = randomPrimitivesHash();
      parameters = randomPrimitivesHash();

    # ================

    test "Should return not exact copy of config", ->
      dm.setConfig(config, parameters);
      copy = dm.getConfig();

      assert.notEqual(config, copy, "Must not be equal objects");

      _.each copy,       (value, key) -> assert.strictEqual config[key], value,          "Config values must be strict equal";
      _.each parameters, (value, key) -> assert.strictEqual value, dm.getParameter(key), "Parameters values must be strict equal";

    # ================

    test "Should return value by key", ->
      key = chance.word();
      config[key] = value = randomPrimitivesHash();
      dm.setConfig(config);
      result = dm.getConfig(key);

      assert.notEqual(result, value, "Must not be equal objects");
      _.each result, (val, key) -> assert.strictEqual value[key], val, "Config values must be strict equal";



  # setParameter
  # -----------

  suite "#setParameter", ->

    dm         = null;
    parameters = null;

    setup ->
      dm = new DM;
      parameters = randomPrimitivesHash();

    # ================

    test "Should set parameter", ->
      _.each parameters, (value, key) -> dm.setParameter(key, value);
      _.each parameters, (value, key) -> assert.strictEqual value, dm.getParameter(key), "Parameters values must be strict equal";

    # ================

    test "Should throw Error when parameter is already set", ->
      key   = chance.word();
      value = chance.word();

      dm.setParameter(key, value);

      try
        dm.setParameter(key, chance.word())
      catch err
        error = err;

      assert.instanceOf error, Error;



  # getParameter
  # ------------

  suite "#getParameter", ->

    dm         = null;
    parameters = null;

    setup ->
      dm = new DM;
      parameters = randomPrimitivesHash();

    # ================

    test "Should get parameter", ->
      _.each parameters, (value, key) -> dm.setParameter(key, value);
      _.each parameters, (value, key) -> assert.strictEqual value, dm.getParameter(key), "Parameters values must be strict equal";

    # ================

    test "Should return null, when parameter is not set", ->
      value = dm.getParameter(chance.word());

      assert.isNull value;



  # setAsync
  # --------

  suite "#setAsync", ->

    dm    = null;
    async = null;

    setup ->
      dm    = new DM;
      async = new Async;

    test "Should accept adapter of expected interface", ->
      try
        dm.setAsync(async);
      catch err
        error = err;

      assert.isUndefined error;

    test "Should throw an error when given adapter is not of expected interface", ->
      try
        dm.setAsync(new Object);
      catch err
        error = err;

      assert.instanceOf error, Error;

    test "Should throw an error when nothing is given", ->
      try
        dm.setAsync();
      catch err
        error = err;

      assert.instanceOf error, Error;



  # setLoader
  # ---------

  suite "#setLoader", ->

    dm     = null;
    loader = null;

    setup ->
      dm     = new DM;
      loader = new Loader;

    test "Should accept adapter of expected interface", ->
      try
        dm.setLoader(loader);
      catch err
        error = err;

      assert.isUndefined error;

    test "Should throw an error when given adapter is not of expected interface", ->
      try
        dm.setLoader(new Object);
      catch err
        error = err;

      assert.instanceOf error, Error;

    test "Should throw an error when nothing is given", ->
      try
        dm.setLoader();
      catch err
        error = err;

      assert.instanceOf error, Error;



  # parseString
  # -----------

  suite "#parseString", ->

    dm = null;
    async  = null;
    loader = null;

    setup ->
      dm = new DM;
      async  = new Async;
      loader = new Loader;

      dm.setAsync(async);
      dm.setLoader(loader.setAsync(async));

    # ================

    test "Should throw an error when nothing is given", ->

      sinon.stub(async, "reject", (err) ->
        return err;
      );

      error = dm.parseString();

      sinon.assert.calledOnce(async.reject);
      assert.instanceOf error, Error;

    # ================

    test "Should parse as parameter", ->
      key    = chance.word();
      string = "%" + key + "%";
      value  = chance.word();

      sinon.stub(async, "resolve", (value) ->
        return value;
      );

      mock = sinon.mock(dm)
      .expects("getParameter")
      .on(dm)
      .once()
      .withExactArgs(key)
      .returns(value);

      result = dm.parseString(string);

      mock.verify();
      assert.strictEqual result, value;

    # ================

    test "Should parse as service without anything", (done) ->
      name = chance.word();
      string = "@" + name;
      value = chance.word();

      sinon.stub(async, "resolve", RSVP.resolve);
      sinon.stub(async, "all",     RSVP.all);

      mock = sinon.mock(dm)
      .expects("get")
      .on(dm)
      .once()
      .withArgs(name)
      .returns(value);

      dm.parseString(string)
      .then((result)->
          try
            mock.verify();
            assert.strictEqual result, value;
          catch err
            error = err

          done(error);
        )
      .catch(done);

    # ================

    test "Should parse as service's method", (done) ->
      name    = chance.word();
      handler = chance.word();
      string = "@" + name + ":" + handler;
      value = chance.word();

      sinon.stub(async, "resolve", RSVP.resolve);
      sinon.stub(async, "all", RSVP.all);

      mock = sinon.mock(dm)
      .expects("get")
      .on(dm)
      .once()
      .withExactArgs(name, handler)
      .returns(value);

      dm.parseString(string)
      .then((result)->
          try
            mock.verify();
            assert.strictEqual result, value;
          catch err
            error = err

          done(error);
        )
      .catch(done)

    # ================

    test "Should parse as call of service's method", (done) ->
      name    = chance.word();
      handler = chance.word();
      string = "@" + name + ":" + handler + "[]";
      value = chance.word();

      sinon.stub(async, "resolve", RSVP.resolve);
      sinon.stub(async, "all", RSVP.all);

      mock = sinon.mock(dm)
      .expects("get")
      .on(dm)
      .once()
      .withExactArgs(name, handler, [])
      .returns(value);

      dm.parseString(string)
      .then((result)->
          try
            mock.verify();
            assert.strictEqual result, value;
          catch err
            error = err

          done(error);
        )
      .catch(done);

    # ================

    test "Should parse as call of service's method with arguments", (done) ->
      name    = chance.word();
      handler = chance.word();

      word      = chance.word();
      int       = chance.integer();
      object    = {a: chance.integer(), b: chance.word()};
      parameter = chance.word();
      parameterValue = chance.integer();
      service   = chance.word();
      serviceValue = chance.word();

      args = [word, int, object, "%" + parameter + "%", "@" + service];

      string = "@" + name + ":" + handler + JSON.stringify(args);

      value = chance.word();

      sinon.stub(async, "resolve", RSVP.resolve);
      sinon.stub(async, "all", RSVP.all);

      sinon.stub(dm, "getParameter", (key) -> parameterValue)

      parseStringSpy = sinon.spy(dm, "parseString");

      getStub = sinon.stub(dm, "get", (key, handler, args) ->
        if (key == name) then return value;
        if (key == service) then return serviceValue;
      );

      dm.parseString(string)
      .then((result)->
          try
            assert.isTrue getStub.calledTwice, "#get called twice";
            assert.isTrue getStub.firstCall.calledWithExactly(service), "#get first time called with service from arguments"
            assert.isTrue getStub.secondCall.calledWithExactly(name, handler, [word, int, object, parameterValue, serviceValue]), "#get second time called with methods service, name of method, and its arguments";

            assert.strictEqual result, value;
          catch err
            error = err

          done(error);
        )
      .catch(done);

    # ================

    test "Should parse as resource with handler", (done)->
      path    = chance.word();
      handler = chance.word();
      string = "#" + handler + "!" + path + "#";

      handled = chance.word();

      sinon.stub(async, "resolve", RSVP.resolve);
      sinon.stub(async, "all",     RSVP.all);

      getResourceStub = sinon.stub(dm, "getResource", (path, handler) ->
        return RSVP.resolve(handled);
      );

      parseStringSpy = sinon.spy(dm, "parseString");

      dm.parseString(string).then((result)->
        try
          assert.isTrue getResourceStub.alwaysCalledOn(dm),               "#getResource is not called on DM";
          assert.isTrue getResourceStub.calledOnce,                       "#getResource is not called once";
          assert.isTrue getResourceStub.calledWithExactly(path, handler), "#getResource is not called once exactly with path and handler";

          assert.isTrue parseStringSpy.calledThrice,                          "#parseString is not called thrice"
          assert.isTrue parseStringSpy.alwaysCalledOn(dm),                    "#parseString is not always called on DM"
          assert.isTrue parseStringSpy.getCall(1).calledWithExactly(path),    "#parseString first call is not called on path"
          assert.isTrue parseStringSpy.getCall(2).calledWithExactly(handler), "#parseString second call is not called on handler"

          assert.strictEqual result, handled;
        catch err
          error = err;

        done(error);
      );


    # ================

    test "Should parse as resource without handler", (done)->
      path = chance.word();
      string = "#" + path + "#";
      value = chance.word();

      sinon.stub(async, "resolve", RSVP.resolve);
      sinon.stub(async, "all",     RSVP.all);

      getResourceStub = sinon.stub(dm, "getResource", () ->
        return RSVP.resolve(value);
      );

      parseStringSpy = sinon.spy(dm, "parseString");

      dm.parseString(string).then((result)->
        try
          assert.isTrue getResourceStub.alwaysCalledOn(dm),      "#getResource is not called on DM";
          assert.isTrue getResourceStub.calledOnce,              "#getResource is not called once";
          assert.isTrue getResourceStub.calledWithExactly(path), "#getResource is not called once exactly with path and handler";

          assert.isTrue parseStringSpy.calledTwice,                           "#parseString is not called twice"
          assert.isTrue parseStringSpy.alwaysCalledOn(dm),                    "#parseString is not always called on DM"
          assert.isTrue parseStringSpy.getCall(1).calledWithExactly(path),    "#parseString first call is not called on path"

          assert.strictEqual result, value;
        catch err
          error = err;

        done(error);
      );


  # parseObject
  # -----------

  suite "#parseObject", ->

    dm     = null;
    async  = null;
    loader = null;

    setup ->
      dm = new DM;
      async = new Async;
      loader = new Loader;

      sinon.stub(async, "all",     RSVP.all);
      sinon.stub(async, "resolve", RSVP.resolve);

      dm.setAsync(async);
      dm.setLoader(loader.setAsync(async));

    # ================

    test "Should fall in recursion with objects", (done) ->
      key    = chance.word();
      nested = chance.word();
      string = chance.word();

      object = {};
      object[key] = string;
      config = {};
      config[nested] = object;

      parseObjectSpy = sinon.spy(dm, "parseObject");

      sinon.stub(dm, "parseString", (string) -> RSVP.resolve(string));

      dm.parseObject(config)
      .then((result) ->
          try
            assert.isTrue parseObjectSpy.calledTwice,                   "#parse is not called twice";
            assert.isTrue parseObjectSpy.secondCall.calledWith(object), "#parse is not called with nested object";
            assert.isTrue parseObjectSpy.alwaysCalledOn(dm),            "#parse is not called always on DM";

            assert.property result, nested;
            assert.isObject result[nested];
            assert.property result[nested], key;
          catch err
            error = err

          done(error);
        );

    # ================

    test "Should fall in recursion with arrays", (done) ->
      nested = chance.word();
      string = chance.word();

      array = [];
      array.push(string);
      config = {};
      config[nested] = array;

      parseObjectSpy = sinon.spy(dm, "parseObject");

      sinon.stub(dm, "parseString", (string) -> RSVP.resolve(string));

      dm.parseObject(config)
      .then((result) ->
          try
            assert.isTrue parseObjectSpy.calledTwice,                   "#parse is not called twice";
            assert.isTrue parseObjectSpy.secondCall.calledWith(array),  "#parse is not called with nested array";
            assert.isTrue parseObjectSpy.alwaysCalledOn(dm),            "#parse is not called always on DM";

            assert.property result, nested;
            assert.isArray result[nested];
            assert.strictEqual result[nested].length, array.length;
          catch err
            error = err

          done(error);
        );

    # ================

    test "Should return escaped value", (done) ->
      key    = chance.word();
      nested = chance.word();
      string = chance.word();

      object = {};
      object[key] = string;
      config = {};
      config[nested] = object;

      parseObjectSpy = sinon.spy(dm, "parseObject");

      dm.parseObject(DM.escape(config))
      .then((result) ->
          try
            assert.isTrue parseObjectSpy.calledOnce, "#parse is not called once";

            assert.strictEqual result, config;
            assert.property result, nested;
            assert.isObject result[nested];
          catch err
            error = err

          done(error);
        );

  # parse
  # -----

  suite "#parse", ->

    dm     = null;
    async  = null;
    loader = null;

    setup ->
      dm = new DM;
      async  = new Async;
      loader = new Loader;

      sinon.stub(async, "all",     RSVP.all);
      sinon.stub(async, "resolve", RSVP.resolve);

      dm.setAsync(async);
      dm.setLoader(loader.setAsync(async));

    # ================

    test "Should parse string", (done) ->
      parseStringSpy = sinon.stub(dm, "parseString", RSVP.resolve);

      dm.parse(chance.word())
      .then ->
          try
            assert.isTrue parseStringSpy.calledOnce, "#parseString is not called once";
          catch err
            error = err;

          done(error);

    # ================

    test "Should parse object", (done) ->
      object = {};
      parseObjectSpy = sinon.stub(dm, "parseObject", RSVP.resolve);

      dm.parse(object)
      .then ->
          try
            assert.isTrue parseObjectSpy.calledOnce, "#parseObject is not called once";
          catch err
            error = err;

          done(error);

    # ================

    test "Should parse array", (done) ->
      array = [];
      parseObjectSpy = sinon.stub(dm, "parseObject", RSVP.resolve);

      dm.parse(array)
      .then ->
          try
            assert.isTrue parseObjectSpy.calledOnce, "#parseObject is not called once";
          catch err
            error = err;

          done(error);

    # ================

    test "Should not parse numbers", (done) ->
      number = chance.integer();

      parseObjectSpy = sinon.stub(dm, "parseObject", RSVP.resolve);
      parseStringSpy = sinon.stub(dm, "parseString", RSVP.resolve);

      dm.parse(number)
      .then (result) ->
          try
            assert.strictEqual result, number;
            assert.isFalse parseObjectSpy.called, "#parseObject is called";
            assert.isFalse parseStringSpy.called, "#parseString is called";
          catch err
            error = err;

          done(error);

    # ================

    test "Should not parse any other objects from Array, String, Object", (done) ->
      value = new Date();

      parseObjectSpy = sinon.stub(dm, "parseObject", RSVP.resolve);
      parseStringSpy = sinon.stub(dm, "parseString", RSVP.resolve);

      dm.parse(value)
      .then (result) ->
          try
            assert.strictEqual result, value;
            assert.isFalse parseObjectSpy.called, "#parseObject is called";
            assert.isFalse parseStringSpy.called, "#parseString is called";
          catch err
            error = err;

          done(error);


      # getResource
      # ------------

  suite "#getResource", ->

    dm = null;
    async  = null;
    loader = null;

    setup ->
      dm = new DM;
      async  = new Async;
      loader = new Loader;

      sinon.stub(async, "all",     (promises) -> RSVP.all(promises));
      sinon.stub(async, "resolve", (value)    -> RSVP.resolve(value));
      sinon.stub(async, "reject",  (err)      -> RSVP.reject(err));

      dm.setAsync(async);
      dm.setLoader(loader.setAsync(async));

    # ================

    test "Should pass #read result directly in #handler", (done) ->
      path     = chance.word();
      resource = chance.word();

      handler = sinon.spy();

      sinon.stub(loader, "read", (path) -> RSVP.resolve(resource));

      dm.getResource(path, handler)
      .then(->
          try
            assert.isTrue handler.calledOnce,           "handler function is not called once";
            assert.isTrue handler.calledWith(resource), "handler function is not called with result of require";
          catch err
            error = err;

          done(error);

        )
      .catch(done);

    # ================

    test "Should return #handler result", (done) ->
      path   = chance.word();
      handled = chance.word();
      handler = sinon.spy(->handled);

      sinon.stub(loader, "read", (path) -> RSVP.resolve());

      dm.getResource(path, handler)
      .then((result)->
          try
            assert.strictEqual result, handled, "#getResource result is not strict equal to expected";
          catch err
            error = err;

          done(error);

        )
      .catch(done);

    # ================

    test "Should call #read for path if parsed handler is function", (done) ->
      path = chance.word();
      handler = ->;

      readStub = sinon.stub(loader, "read", (path) -> RSVP.resolve());

      dm.getResource(path, handler)
      .then((result)->
          try
            assert.isTrue readStub.calledOnce,              "#read is not called once";
            assert.isTrue readStub.calledWithExactly(path), "#read is not called with path";
          catch err
            error = err;

          done(error);
        )

    # ================

    test "Should call #read with path and handler, if parsed handler is string", (done) ->
      path = chance.word();
      handler = chance.word();

      readStub = sinon.stub(loader, "read", (path) -> RSVP.resolve());

      dm.getResource(path, handler)
      .then((result)->
          try
            assert.isTrue readStub.calledOnce,                       "#read is not called once";
            assert.isTrue readStub.calledWithExactly(path, handler), "#read is not called with path";
          catch err
            error = err;

          done(error);
        )

    # ================

    test "Should call #read for path if handler is not given", (done) ->
      path = chance.word();

      readStub = sinon.stub(loader, "read", (path) -> RSVP.resolve());

      dm.getResource(path)
      .then((result)->
          try
            assert.isTrue readStub.calledOnce,       "#read is not called once";
            assert.isTrue readStub.calledWith(path), "#read is not called with path";
          catch err
            error = err;

          done(error);
        )

    # ================

    test "Should throw an error if path is not string", (done) ->
      path = null;
      handler = ->;

      readStub = sinon.stub(loader, "read", (path) -> RSVP.resolve());

      dm.getResource(path, handler)
      .then((result)->
          done(new Error("#getResource is successfully resolved instead"))
        )
      .catch((error) ->
          try
            assert.isTrue readStub.callCount == 0, "#read was called";
            assert.instanceOf error, Error;
          catch err
            _error = err;

          done(_error)
        )


  # build
  # ------------

  suite "#build", ->

    dm          = null;
    key         = null;
    constructor = null;
    spy         = null;
    calls       = null;
    spyA        = null;
    spyB        = null;
    spyC        = null;
    args        = null;
    argA        = null;
    argB        = null;
    argC        = null;
    properties  = null;
    propA       = null;
    propB       = null;
    propC       = null;
    config      = null;

    setup ->
      dm = new DM;
      async  = new Async;
      loader = new Loader;

      key = chance.word();
      path = chance.word();
      constructor = sinon.spy();
      constructor.prototype.spy = spy = sinon.spy();
      config = {};
      config[key] = {
        path: path,
        arguments: args = [argA = chance.word(), argB = chance.integer(), argC = {}],
        calls:     calls = [["spy", [spyA = chance.word(), spyB = chance.integer(), spyC = {}]]],
        properties: properties = {
          a: propA = chance.word(),
          b: propB = chance.integer(),
          c: propC = {a:1}
        }
      };

      sinon.stub(async,  "all",     (promises) -> RSVP.all(promises));
      sinon.stub(async,  "resolve", (value)    -> RSVP.resolve(value));
      sinon.stub(async,  "reject",  (err)      -> RSVP.reject(err));
      sinon.stub(loader, "require", (_path)    -> if _path == path then return RSVP.resolve(constructor));

      dm.setAsync(async);
      dm.setLoader(loader.setAsync(async));

    # ================

    test "Should instantiate object of given constructor, with given args, calls and setting properties", (done) ->
      dm.setConfig(config);

      dm.build(key)
      .then((service) ->
        try
          assert.isTrue constructor.calledOnce,                          "Constructor was not called once";
          assert.isTrue constructor.calledWithExactly(argA, argB, argC), "Constructor was not called exactly with given arguments";

          assert.instanceOf service, constructor;

          assert.isTrue spy.calledOnce,                          "Instance call was not called once"
          assert.isTrue spy.calledWithExactly(spyA, spyB, spyC), "Instance call was not called exactly with given arguments"

          assert.propertyVal service, "a", propA
          assert.propertyVal service, "b", propB

          assert.property service, "c"
          _.each service.c, (value, key) -> assert.strictEqual propC[key], value, "Instance sub properties values must be strict equal";

        catch err
          error = err;

        done(error);
      )
      .catch(done);

    # ================

    test "Should call custom factory with constructor, args, calls and properties", (done) ->
      config[key].factory = factory = sinon.spy();
      dm.setConfig(config);

      dm.build(key)
      .then(() ->
        try
          assert.isTrue factory.calledOnce, "Custom factory is not called once"
          assert.isTrue factory.calledWithExactly(constructor, args, calls, properties), "Custom factory is not called once"

        catch err
          error = err;

        done(error);
      )
      .catch(done);



  # get
  # ------------

  suite "#get", ->

    dm = null;

    setup ->
      dm = new DM;
      async  = new Async;
      loader = new Loader;

      sinon.stub(async,  "all",     (promises) -> RSVP.all(promises));
      sinon.stub(async,  "resolve", (value)    -> RSVP.resolve(value));
      sinon.stub(async,  "reject",  (err)      -> RSVP.reject(err));

      dm.setAsync(async);
      dm.setLoader(loader.setAsync(async));

    # ================

    test "Should create just one instance of service", (done) ->
      key = chance.word();
      service = new Object;


      buildStub = sinon.stub(dm, "build", (_key) -> if _key == key then RSVP.resolve(service));

      dm.get(key).then((serviceA)->
        dm.get(key)
        .then((serviceB) ->
            try
              assert.isTrue buildStub.calledOnce,      "#build not called once";
              assert.strictEqual serviceA, serviceB, "#get returned different services"
            catch err
              error = err;

            done(error);
          )
        .catch(done);
      );

    # ================

    test "Should return property of service", (done) ->
      service = new Object;
      prop = chance.word();
      val  = chance.integer();
      service[prop] = val;

      sinon.stub(dm, "build", -> RSVP.resolve(service));

      dm.get(chance.word(), prop)
      .then((value) ->
          try
            assert.strictEqual value, val;
          catch err
            error = err;

          done(error);
        )
      .catch(done);

    # ================

    test "Should return method of service, contexted in service", (done) ->
      service = new Object;
      prop = chance.word();
      val  = () ->
        assert.strictEqual this, service, "Method not contexted in service";
      service[prop] = val;

      sinon.stub(dm, "build", -> RSVP.resolve(service));

      dm.get(chance.word(), prop)
      .then((value) ->
          try
            value();
          catch err
            error = err;

          done(error);
        )
      .catch(done);

    # ================

    test "Should return result of service's method call", (done) ->
      service = new Object;
      prop = chance.word();
      args = [argA = chance.word(), argB = chance.integer(), argC = {}]
      result = chance.word();

      val  = () ->
        assert.strictEqual this, service, "Method not contexted in service";
        return result;

      service[prop] = val;

      sinon.stub(dm, "build", -> RSVP.resolve(service));

      dm.get(chance.word(), prop, args)
      .then((value) ->
          try
            assert.strictEqual value, result;
          catch err
            error = err;

          done(error);
        )
      .catch(done);


  # escape
  # ------------

  suite "#escape", ->

    test "Should return escaped value", () ->
      value = chance.word();
      escaped = DM.escape(value);

      assert.isObject escaped;

  # unEscape
  # ------------

  suite "#unEscape", ->

    test "Should return unescaped value", () ->
      value = chance.word();
      escaped = DM.escape(value);
      unescaped = DM.unEscape(escaped);

      assert.strictEqual unescaped, value;

    test "Should return null if it not escaped", () ->
      value = chance.word();
      unescaped = DM.unEscape(value);

      assert.isNull unescaped;



# escaping with array, object, function