var _        = require('lodash'),
    chance   = require('chance'),
    sinon    = require('sinon'),
    chai     = require('chai'),

    assert, noop;

chance = new chance;
assert = chai.assert;

noop = function() {};

module.exports = function(Adaptee, AdapteePromise, ConcreteAdapter, options) {
    suite(options.title, function() {
        setup(noop);

        suite("#promise", function() {
            var adapter;

            setup(function() {
                adapter = new ConcreteAdapter(Adaptee);
            });

            test("Should return promise", function() {
                var promise;

                promise = adapter.promise(noop);

                assert.instanceOf(promise, AdapteePromise);
            });

            test("Should throw an error when resolver is not passed", function() {
                var error;

                try {
                    adapter.promise();
                } catch (err) {
                    error = err;
                }

                assert.instanceOf(error, Error);
            });
        });


        suite("#all", function() {
            var adapter;

            setup(function() {
                adapter = new ConcreteAdapter(Adaptee);
            });

            test("Should return promise", function() {
                var promise;

                promise = adapter.all([]);

                assert.instanceOf(promise, AdapteePromise);
            });

            test("Should return parsed values", function(done) {
                var promise, valueA, valueB;

                valueA = chance.word();
                valueB = chance.word();
                promise = adapter.all([valueA, valueB]);

                promise.then(function(values) {
                    var error;

                    try {
                        assert.isArray(values);
                        assert.strictEqual(values[0], valueA);
                        assert.strictEqual(values[1], valueB);
                    } catch (err) {
                        error = err;
                    }

                    done(error);
                });
            });

        });


        suite("#resolve", function() {
            var adapter;

            setup(function() {
                adapter = new ConcreteAdapter(Adaptee);
            });

            test("Should return promise", function() {
                var promise;

                promise = adapter.resolve();

                assert.instanceOf(promise, AdapteePromise);
            });

            return test("Should return fullfilled promise", function(done) {
                var errorSpy, successSpy, promise, test, value;

                value   = chance.word();
                promise = adapter.resolve(value);

                errorSpy = sinon.spy();
                successSpy = sinon.spy();

                test = function() {
                    var error;

                    try {
                        assert.isTrue(successSpy.calledWithExactly(value));
                        assert.strictEqual(errorSpy.callCount, 0);
                    } catch (err) {
                        error = err;
                    }

                    done(error);
                };

                promise
                    .then(successSpy, errorSpy)
                    .then(test, test);
            });
        });


        return suite("#reject", function() {
            var adapter;

            setup(function() {
                adapter = new ConcreteAdapter(Adaptee);
            });

            test("Should return promise", function() {
                var promise;

                promise = adapter.reject();

                assert.instanceOf(promise, AdapteePromise);
            });

            return test("Should return rejected promise", function(done) {
                var err, errorSpy, promise, successSpy, test;

                err     = chance.word();
                promise = adapter.reject(err);

                errorSpy = sinon.spy();
                successSpy = sinon.spy();

                test = function() {
                    var error;

                    try {
                        assert.isTrue(errorSpy.calledWithExactly(err));
                        assert.strictEqual(successSpy.callCount, 0);
                    } catch (err) {
                        error = err;
                    }

                    done(error);
                };

                promise
                    .then(successSpy, errorSpy)
                    .then(test, test);
            });
        });
    });
};
