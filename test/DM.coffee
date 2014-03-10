_      = require('lodash');
chance = require('chance');
sinon  = require('sinon');
chai   = require('chai');
# TODO check this out https://github.com/square/es6-module-transpiler/issues/85
DM     = require('./dist/dm.js').default;
Loader = require('./dist/dm/adapter/loader').default;
Async  = require('./dist/dm/adapter/async').default;
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

    test "Should parse as service with handler", (done) ->
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

    test "Should parse as service with calling handler", (done) ->
      name    = chance.word();
      handler = chance.word();
      string = "@" + name + ":" + handler + "()";
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

    test "Should parse as service with calling handler and arguments", (done) ->
      name    = chance.word();
      handler = chance.word();

      word      = chance.word();
      int       = chance.integer();
      parameter = chance.word();
      parameterValue = chance.integer();
      service   = chance.word();
      serviceValue = chance.word();
      args = [word, int, "%" + parameter + "%", "@" + service];

      string = "@" + name + ":" + handler + "(" + args.join(",") + ")";

      value = chance.word();

      sinon.stub(async, "resolve", RSVP.resolve);
      sinon.stub(async, "all", RSVP.all);

      parseStringSpy = sinon.spy(dm, "parseString");

      getStub = sinon.stub(dm, "get", (key, handler, args) ->
        if (key == name) then return value;
        if (key == service) then return serviceValue;
      );

      getParameterStub = sinon.stub(dm, "getParameter", (key) ->
        if (key == parameter) then return parameterValue;
      )

      dm.parseString(string)
      .then((result)->
          try
            assert.isTrue getStub.calledTwice, "#get called twice";
            assert.isTrue getStub.firstCall.calledWithExactly(service), "#get first called with service"
            assert.isTrue getStub.secondCall.calledWithExactly(name, handler, [word, int, parameterValue, serviceValue]), "#get second called with name";

            assert.equal parseStringSpy.callCount, 8, "#parseString called 8 times"

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

      mock = sinon.mock(dm);

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

    test "Should parse object properties", (done) ->
      key    = chance.word();
      string = chance.word();

      config = {};
      config[key] = string;

      parseStringStub = sinon.stub(dm, "parseString", (string) -> RSVP.resolve(string));

      result = dm.parse(config);

      result.then((result) ->
        try
          assert.isTrue parseStringStub.called,             "#parseString is never called"
          assert.isTrue parseStringStub.calledWith(string), "#parseString is never called with string"
          assert.isTrue parseStringStub.alwaysCalledOn(dm), "#parseString is not called always on DM"

          assert.isObject result;
          assert.property result, key
        catch err
          error = err

        done(error);
      );

    # ================

    test "Should parse array values", (done) ->
      string = chance.word();

      config = [];
      config.push(string);

      parseStringStub = sinon.stub(dm, "parseString", (string) -> RSVP.resolve(string));

      result = dm.parse(config);

      result.then((result) ->
        try
          assert.isTrue parseStringStub.called,             "#parseString is never called"
          assert.isTrue parseStringStub.calledWith(string), "#parseString is never called with string"
          assert.isTrue parseStringStub.alwaysCalledOn(dm), "#parseString is not called always on DM"

          assert.isArray result;
          assert.strictEqual result.length, config.length
        catch err
          error = err

        done(error);
      );

    # ================

    test "Should fall in recursion with objects", (done) ->
      key    = chance.word();
      nested = chance.word();
      string = chance.word();

      object = {};
      object[key] = string;
      config = {};
      config[nested] = object;

      parseSpy = sinon.spy(dm, "parse");

      sinon.stub(dm, "parseString", (string) -> RSVP.resolve(string));

      result = dm.parse(config);

      result.then((result) ->
        try
          assert.isTrue parseSpy.calledTwice,                   "#parse is not called twice";
          assert.isTrue parseSpy.secondCall.calledWith(object), "#parse is not called with nested object";
          assert.isTrue parseSpy.alwaysCalledOn(dm),            "#parse is not called always on DM";

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

      parseSpy = sinon.spy(dm, "parse");

      sinon.stub(dm, "parseString", (string) -> RSVP.resolve(string));

      result = dm.parse(config);

      result.then((result) ->
        try
          assert.isTrue parseSpy.calledTwice,                   "#parse is not called twice";
          assert.isTrue parseSpy.secondCall.calledWith(array),  "#parse is not called with nested array";
          assert.isTrue parseSpy.alwaysCalledOn(dm),            "#parse is not called always on DM";

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
      config[nested] = DM.escape(object);

      parseSpy        = sinon.spy(dm, "parse");
      parseStringSpy  = sinon.spy(dm, "parseString");

      result = dm.parse(config);

      result.then((result) ->
        try
          assert.isTrue parseSpy.calledOnce, "#parse is not called once";

          assert.isTrue parseStringSpy.callCount == 0, "#parseString was called";

          assert.property result, nested;
          assert.isObject result[nested];
          assert.strictEqual result[nested], object;
        catch err
          error = err

        done(error);
      );



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

    test "Should pass require's result directly in handler function", (done) ->
      path     = chance.word();
      resource = chance.word();

      handler = sinon.spy();

      sinon.stub(loader, "require", (path) -> RSVP.resolve(resource));

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

    test "Should return handler function result", (done) ->
      path   = chance.word();
      handled = chance.word();
      handler = sinon.spy(->handled);

      sinon.stub(loader, "require", (path) -> RSVP.resolve());

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

    test "Should call require for path if parsed handler is function", (done) ->
      path = chance.word();
      handler = ->;

      requireStub = sinon.stub(loader, "require", (path) -> RSVP.resolve());

      dm.getResource(path, handler)
      .then((result)->
          try
            assert.isTrue requireStub.calledOnce,              "require function is not called once";
            assert.isTrue requireStub.calledWithExactly(path), "require function is not called with path";
          catch err
            error = err;

          done(error);
        )

    # ================

    test "Should call require for handler!path, if parsed handler is string", (done) ->
      path = chance.word();
      handler = chance.word();

      requireStub = sinon.stub(loader, "require", (path) -> RSVP.resolve());

      dm.getResource(path, handler)
      .then((result)->
          try
            assert.isTrue requireStub.calledOnce,                              "require function is not called once";
            assert.isTrue requireStub.calledWithExactly(handler + "!" + path), "require function is not called with path";
          catch err
            error = err;

          done(error);
        )

    # ================

    test "Should not call require and throw error if parsed handler neither function or string", (done) ->
      path = chance.word();
      handler = {};

      requireStub = sinon.stub(loader, "require", (path) -> RSVP.resolve());

      dm.getResource(path, handler)
      .then((result)->
          done(new Error("#getResource is successfully resolved instead"))
        )
      .catch((error) ->
          try
            assert.isTrue requireStub.callCount == 0, "require function was called";
            assert.instanceOf error, Error;
          catch err
            _error = err;

          done(_error)
        )

    # ================

    test "Should call require for path if handler is not given", (done) ->
      path = chance.word();

      requireStub = sinon.stub(loader, "require", (path) -> RSVP.resolve());

      dm.getResource(path)
      .then((result)->
          try
            assert.isTrue requireStub.calledOnce,              "require function is not called once";
            assert.isTrue requireStub.calledWithExactly(path), "require function is not called with path";
          catch err
            error = err;

          done(error);
        )

    # ================

    test "Should throw an error if path is not string", (done) ->
      path = null;
      handler = ->;

      requireStub = sinon.stub(loader, "require", (path) -> RSVP.resolve());

      dm.getResource(path, handler)
      .then((result)->
          done(new Error("#getResource is successfully resolved instead"))
        )
      .catch((error) ->
          try
            assert.isTrue requireStub.callCount == 0, "require function was called";
            assert.instanceOf error, Error;
          catch err
            _error = err;

          done(_error)
        )



  # initialize
  # ------------

  suite "#initialize", ->

    dm = null;

    setup ->
      dm = new DM;


  # build
  # ------------

  suite "#build", ->

    dm = null;

    setup ->
      dm = new DM;


  # get
  # ------------

  suite "#get", ->

    dm = null;

    setup ->
      dm = new DM;


  # escape
  # ------------

  suite "#escape", ->

    dm = null;

    setup ->
      dm = new DM;



# escaping with array, object, function