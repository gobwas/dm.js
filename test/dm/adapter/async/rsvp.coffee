_           = require('lodash');
chance      = require('chance');
sinon       = require('sinon');
chai        = require('chai');
rsvp        = require('rsvp');
RsvpAdapter = require('../../../dist/dm/adapter/async/rsvp').default;

chance = new chance;
assert = chai.assert;



# ----------------------------
# Tests suite for rsvp adapter
# ----------------------------

suite "rsvp.js", ->

  # Setup
  # -----

  setup ->
    # ...

  # promise
  # -------

  suite "#promise", ->

    adapter = null;

    setup ->
      adapter = new RsvpAdapter(rsvp);

    # ================

    test "Should return promise", ->
      promise = adapter.promise(->);
      assert.instanceOf(promise, rsvp.Promise);

    test "Should throw an error when resolver is not passed", ->
      try
        promise = adapter.promise();
      catch err
        error = err;

      assert.instanceOf(error, Error);

  # all
  # ---

  suite "#all", ->

    adapter = null;

    setup ->
      adapter = new RsvpAdapter(rsvp);

    # ================

    test "Should return promise", ->
      promise = adapter.all([new rsvp.Promise(->)]);
      assert.instanceOf(promise, rsvp.Promise);

    # ================

    test "Should throw an error when promises are not passed", ->
      try
        promise = adapter.all();
      catch err
        error = err

      assert.instanceOf(error, Error);

  # resolve
  # -------

  suite "#resolve", ->

    adapter = null;

    setup ->
      adapter = new RsvpAdapter(rsvp);

    # ================

    test "Should return promise", ->
      promise = adapter.resolve();
      assert.instanceOf(promise, rsvp.Promise);

    # ================

    test "Should return fullfilled promise", (done) ->
      value = chance.word();
      promise = adapter.resolve(value);

      assert.instanceOf(promise, rsvp.Promise);

      errorSpy   = sinon.spy();
      successSpy = sinon.spy();

      final = promise
        .then(successSpy)
        .catch(errorSpy);

      test = () ->
        try
          assert.isTrue(successSpy.calledWithExactly(value));
          assert.strictEqual(errorSpy.callCount, 0);
        catch err
          error = err;

        done(error);

      final.then(test, test);

  # reject
  # ------

  suite "#reject", ->

    adapter = null;

    setup ->
      adapter = new RsvpAdapter(rsvp);

    # ================

    test "Should return promise", ->
      promise = adapter.reject();
      assert.instanceOf(promise, rsvp.Promise);

    # ================

    test "Should return rejected promise", (done) ->
      err = chance.word();
      promise = adapter.reject(err);

      assert.instanceOf(promise, rsvp.Promise);

      errorSpy   = sinon.spy(->console.log('error!'));
      successSpy = sinon.spy(->console.log('succ'));

      final = promise
        .then(successSpy)
        .catch(errorSpy);

      test = () ->
        try
          assert.isTrue(errorSpy.calledWithExactly(err));
          assert.strictEqual(successSpy.callCount, 0);
        catch err
          error = err;

        done(error);

      final.then(test, test);

