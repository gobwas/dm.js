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
  # ------------

  suite "#parseString", ->

    dm     = null;
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

    test "Should parse as service without", ->
      name = chance.word();
      string = "@" + name;
      value = chance.word();

      mock = sinon.mock(dm)
        .expects("get")
        .on(dm)
        .once()
        .withExactArgs(name, undefined)
        .returns(value);

      result = dm.parseString(string);

      mock.verify();
      assert.strictEqual result, value;

    test "Should parse as service with handler", ->
      name    = chance.word();
      handler = chance.word();
      string = "@" + name + ":" + handler;
      value = chance.word();

      mock = sinon.mock(dm)
        .expects("get")
        .on(dm)
        .once()
        .withExactArgs(name, handler)
        .returns(value);

      result = dm.parseString(string);

      mock.verify();
      assert.strictEqual result, value;

    # ================

    test "Should parse as resource with handler", ->
      name     = chance.word();
      func     = chance.word();
      handler  = "@" + name + ":" + func;
      resource = chance.word();
      string = "#" + handler + "!" + resource + "#";
      value = chance.word();

      mock = sinon.mock(dm);

      mock
        .expects("getResource")
        .on(dm)
        .once()
        .withExactArgs(resource, handler, string)
        .returns(value);

      result = dm.parseString(string);

      mock.verify();
      assert.strictEqual result, value;

    # ================

    test "Should parse as resource without handler", ->
      resource = chance.word();
      string = "#" + resource + "#";
      value = chance.word();

      mock = sinon.mock(dm)
        .expects("getResource")
        .on(dm)
        .once()
        .withArgs(resource)
        .returns(value);

      result = dm.parseString(string);

      mock.verify();
      assert.strictEqual result, value;


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

      dm.setAsync(async);
      dm.setLoader(loader.setAsync(async));

    test "Should parse object properties", (done) ->
      key    = chance.word();
      string = chance.word();

      config = {};
      config[key] = string;

      sinon.stub(async, "all", (promises) -> RSVP.all(promises));
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

    test "Should parse array values", (done) ->
      string = chance.word();

      config = [];
      config.push(string);

      sinon.stub(async, "all", (promises) -> RSVP.all(promises));
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
      sinon.stub(async, "all", (promises) -> RSVP.all(promises));

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


    test "Should fall in recursion with arrays", (done) ->
      nested = chance.word();
      string = chance.word();

      array = [];
      array.push(string);
      config = {};
      config[nested] = array;

      parseSpy = sinon.spy(dm, "parse");

      sinon.stub(dm, "parseString", (string) -> RSVP.resolve(string));
      sinon.stub(async, "all", (promises) -> RSVP.all(promises));

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

      sinon.stub(async, "all", (promises) -> RSVP.all(promises));
      sinon.stub(async, "resolve", (value) -> RSVP.resolve(value));

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

    setup ->
      dm = new DM;


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

  suite "#get", ->

    dm = null;

    setup ->
      dm = new DM;



# escaping with array, object, function