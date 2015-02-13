var _         = require('lodash'),
    sinon     = require('sinon'),
    chai      = require('chai'),
    Chance    = require("chance"),
    AMDLoader = require("../../lib/loader/amd"),
    Async     = require("../../lib/async"),
    RSVP      = require("rsvp"),
    assert, expect, chance;

assert = chai.assert;
expect = chai.expect;
chance = new Chance;

describe("AMDLoader", function() {
    var loader, async, adaptee;

    beforeEach(function() {
        adaptee = sinon.spy(function(path, resolve, reject) {
            resolve();
        });

        loader = new AMDLoader(adaptee);

        async = Object.create(Async.prototype);
        sinon.stub(async, "promise", function(cb) {
            return new RSVP.Promise(cb);
        });
    });

    describe("#require", function() {

        it("should throw error, when async is not Async", function() {
            expect(loader.require.bind(loader)).to.throw(TypeError, "Async is expected");
        });

        it("should call require with proper arguments", function(done) {
            var path;

            path = chance.word();

            loader
                .require(path, async)
                .then(function() {
                    var call;

                    expect(call = adaptee.getCall(0)).to.exist();
                    expect(call.calledWith([path])).to.be.true();
                })
                .then(done, done);
        });

        it("should reject with require`s error", function(done) {
            var error;

            error = new Error(chance.word());

            adaptee = sinon.spy(function(path, resolve, reject) {
                reject(error);
            });

            loader = new AMDLoader(adaptee);

            loader
                .require(chance.word(), async)
                .then(function() {
                    done(new Error("Fulfilled, but expected the rejection"));
                })
                .catch(function(err) {
                    expect(err).equal(error);
                })
                .then(done, done);
        });

        it("should resolve with require`s result", function(done) {
            var result;

            result = {};

            adaptee = sinon.spy(function(path, resolve, reject) {
                resolve(result);
            });

            loader = new AMDLoader(adaptee);

            loader
                .require(chance.word(), async)
                .then(function(resp) {
                    expect(resp).equal(result);
                })
                .then(done, done);
        });

    });

    describe("#read", function() {

        it("should throw error, when async is not Async", function() {
            expect(loader.require.bind(loader)).to.throw(TypeError, "Async is expected");
        });

        it("should call require with `text!` prefix, if plugin is not passed", function(done) {
            var path;

            path = chance.word();

            loader
                .read(path, async)
                .then(function() {
                    var call;

                    expect(call = adaptee.getCall(0)).to.exist();
                    expect(call.calledWith(["text!" + path])).to.be.true();
                })
                .then(done, done);
        });

        it("should call require with given handler prefix", function(done) {
            var path, prefix;

            path = chance.word();
            prefix = chance.word();

            loader
                .read(path, async, { handler: prefix })
                .then(function() {
                    var call;

                    expect(call = adaptee.getCall(0)).to.exist();
                    expect(call.calledWith([prefix + "!" + path])).to.be.true();
                })
                .then(done, done);
        });

        it("should reject with require`s error", function(done) {
            var error;

            error = new Error(chance.word());

            adaptee = sinon.spy(function(path, resolve, reject) {
                reject(error);
            });

            loader = new AMDLoader(adaptee);

            loader
                .read(chance.word(), async)
                .then(function() {
                    done(new Error("Fulfilled, but expected the rejection"));
                })
                .catch(function(err) {
                    expect(err).equal(error);
                })
                .then(done, done);
        });

        it("should resolve with require`s result", function(done) {
            var result;

            result = {};

            adaptee = sinon.spy(function(path, resolve, reject) {
                resolve(result);
            });

            loader = new AMDLoader(adaptee);

            loader
                .read(chance.word(), async)
                .then(function(resp) {
                    expect(resp).equal(result);
                })
                .then(done, done);
        });

    });

});