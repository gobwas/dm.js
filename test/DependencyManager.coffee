_                 = require('lodash');
chance            = require('chance');
sinon             = require('sinon');
chai              = require('chai');
DependencyManager = require('../src/DependencyManager.js');

chance = new chance;
assert = chai.assert;

# ---------------------------------
# Tests suite for DependencyManager
# ---------------------------------

suite "DependencyManager.js", ->

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

    DM         = null;
    config     = null;
    parameters = null;

    setup ->
      DM         = new DependencyManager;
      config     = randomPrimitivesHash();
      parameters = randomPrimitivesHash();

    # ================

    test "Should set config without errors", ->
      try
        DM.setConfig(config, parameters);
      catch err
        error = err

      assert.isUndefined error

    # ================

    test "Should throw Error if nothing given", ->
      try
        DM.setConfig();
      catch err
        error = err

      assert.instanceOf error, Error;

    # ================

    test "Should throw Error when configuring twice", ->
      DM.setConfig(config);

      try
        DM.setConfig(randomPrimitivesHash());
      catch err
        error = err

      assert.instanceOf error, Error;

  # getConfig
  # ---------

  suite "#getConfig", ->

    DM         = null;
    config     = null;
    parameters = null;

    setup ->
      DM         = new DependencyManager;
      config     = randomPrimitivesHash();
      parameters = randomPrimitivesHash();

    # ================

    test "Should return not exact copy of config", ->
      DM.setConfig(config, parameters);
      copy = DM.getConfig();

      assert.notEqual(config, copy, "Must not be equal objects");

      _.each copy,       (value, key) -> assert.strictEqual config[key], value,          "Config values must be strict equal";
      _.each parameters, (value, key) -> assert.strictEqual value, DM.getParameter(key), "Parameters values must be strict equal";

  # setParameter
  # -----------

  suite "#setParameter", ->

    DM         = null;
    parameters = null;

    setup ->
      DM = new DependencyManager;
      parameters = randomPrimitivesHash();

    # ================

    test "Should set parameter", ->
      _.each parameters, (value, key) -> DM.setParameter(key, value);
      _.each parameters, (value, key) -> assert.strictEqual value, DM.getParameter(key), "Parameters values must be strict equal";

    # ================

    test "Should throw Error when parameter is already set", ->
      key   = chance.word();
      value = chance.word();

      DM.setParameter(key, value);

      try
        DM.setParameter(key, chance.word())
      catch err
        error = err;

      assert.instanceOf error, Error;


  # getParameter
  # ------------

  suite "#getParameter", ->

    DM         = null;
    parameters = null;

    setup ->
      DM = new DependencyManager;
      parameters = randomPrimitivesHash();

    # ================

    test "Should get parameter", ->
      _.each parameters, (value, key) -> DM.setParameter(key, value);
      _.each parameters, (value, key) -> assert.strictEqual value, DM.getParameter(key), "Parameters values must be strict equal";

    # ================

    test "Shoul return null, when parameter is not set", ->
      value = DM.getParameter(chance.word());

      assert.isNull value;


  # parseString
  # ------------

  suite "#parseString", ->

    DM = null;

    setup ->
      DM = new DependencyManager;

    # ================

    test "Should throw Error when nothing is given", ->
      try
        DM.parseString();
      catch err
        error = err;

      assert.instanceOf error, Error;

    # ================

    test "Should parse as parameter", ->
      key = chance.word();
      string = "%" + key + "%";
      value = chance.word();

      mock = sinon.mock(DM)
        .expects("getParameter")
        .on(DM)
        .once()
        .withExactArgs(key)
        .returns(value);

      result = DM.parseString(string);

      mock.verify();
      assert.strictEqual result, value;

    # ================

    test "Should parse as service", ->
      key = chance.word();
      string = "@" + key;
      value = chance.word();

      mock = sinon.mock(DM)
        .expects("get")
        .on(DM)
        .once()
        .withExactArgs(key)
        .returns(value);

      result = DM.parseString(string);

      mock.verify();
      assert.strictEqual result + 1, value;

    # ================

    test "Should parse as resource with handler", ->
      handler  = chance.word();
      resource = chance.word();
      string = "#" + handler + "!" + resource + "#";
      value = chance.word();

      mock = sinon.mock(DM)
        .expects("getResource")
        .on(DM)
        .once()
        .withExactArgs(resource, handler)
        .returns(value);

      result = DM.parseString(string);

      mock.verify();
      assert.strictEqual result, value;

    # ================

    test "Should parse as resource without handler", ->
      resource = chance.word();
      string = "#" + resource + "#";
      value = chance.word();

      mock = sinon.mock(DM)
        .expects("getResource")
        .on(DM)
        .once()
        .withArgs(resource)
        .returns(value);

      result = DM.parseString(string);

      mock.verify();
      assert.strictEqual result, value;


  # parse
  # -----

  suite "#parse", ->

    DM = null;

    setup ->
      DM = new DependencyManager;







  # getResource
  # ------------

  suite "#getResource", ->

    DM = null;

    setup ->
      DM = new DependencyManager;


  # initialize
  # ------------

  suite "#initialize", ->

    DM = null;

    setup ->
      DM = new DependencyManager;


  # build
  # ------------

  suite "#build", ->

    DM = null;

    setup ->
      DM = new DependencyManager;


  # get
  # ------------

  suite "#get", ->

    DM = null;

    setup ->
      DM = new DependencyManager;

