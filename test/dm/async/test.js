var _        = require('lodash'),
    chance   = require('chance'),
    sinon    = require('sinon'),
    chai     = require('chai'),

    assert;

chance = new chance;
assert = chai.assert;

module.exports = function(Adaptee, AdapteePromise, ConcreteAdapter, options) {
    describe(options.title, function() {

        describe("#promise", function() {
            var adapter;

            beforeEach(function() {
                adapter = new ConcreteAdapter(Adaptee);
            });

            it("Should return promise", function() {
                var promise;

                promise = adapter.promise(_.noop);

                assert.instanceOf(promise, AdapteePromise);
            });

            it("Should throw an error when resolver is not passed", function() {
                var error;

                try {
                    adapter.promise();
                } catch (err) {
                    error = err;
                }

                assert.instanceOf(error, Error);
            });
        });


        describe("#all", function() {
            var adapter;

            beforeEach(function() {
                adapter = new ConcreteAdapter(Adaptee);
            });

            it("Should return promise", function() {
                var promise;

                promise = adapter.all([]);

                assert.instanceOf(promise, AdapteePromise);
            });

            it("Should return parsed values", function(done) {
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


        describe("#resolve", function() {
            var adapter;

            beforeEach(function() {
                adapter = new ConcreteAdapter(Adaptee);
            });

            it("Should return promise", function() {
                var promise;

                promise = adapter.resolve();

                assert.instanceOf(promise, AdapteePromise);
            });

            it("Should return fullfilled promise", function(done) {
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

            //it.skip("Should wrap given promise", function(done) {
            //    todo
            //});
        });


        describe("#reject", function() {
            var adapter;

            beforeEach(function() {
                adapter = new ConcreteAdapter(Adaptee);
            });

            it("Should return promise", function() {
                var promise;

                promise = adapter.reject();

                assert.instanceOf(promise, AdapteePromise);
            });

            it("Should return rejected promise", function(done) {
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
                    } catch (err_) {
                        error = err_;
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
