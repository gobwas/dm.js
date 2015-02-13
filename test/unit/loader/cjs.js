var _         = require('lodash'),
    sinon     = require('sinon'),
    chai      = require('chai'),
    Chance    = require("chance"),
    CJSLoader = require("../../../lib/loader/cjs"),
    Async     = require("../../../lib/async"),
    pathUtils = require("path"),
    RSVP      = require("rsvp"),
    assert, expect, chance;

assert = chai.assert;
expect = chai.expect;
chance = new Chance;

describe("CJSLoader", function() {
    var loader, async, adaptee;

    beforeEach(function() {
        adaptee = sinon.spy();

        loader = new CJSLoader(adaptee);

        async = Object.create(Async.prototype);
        sinon.stub(async, "promise", function(cb) {
            return new RSVP.Promise(cb);
        });
    });

    describe("#require", function() {

        it("should throw error, when async is not Async", function() {
            expect(loader.require.bind(loader)).to.throw(TypeError, "Async is expected");
        });

        it("should call require with path", function(done) {
            var path;

            path = chance.word();

            loader
                .require(path, async)
                .then(function() {
                    var call;

                    expect(call = adaptee.getCall(0)).to.exist();
                    expect(call.calledWith(path)).to.be.true();
                })
                .then(done, done);
        });

        it("should call require with normalized path", function(done) {
            var path, base, relative;

            path = chance.word();
            base = "/" + chance.word();
            relative = pathUtils.resolve(base, path);

            loader = new CJSLoader(adaptee, {
                base:    base,
                browser: false
            });

            loader
                .require(path, async)
                .then(function() {
                    var call;

                    expect(call = adaptee.getCall(0)).to.exist();
                    expect(call.calledWith(relative)).to.be.true();
                })
                .then(done, done);
        });

    });

    describe("#read", function() {
        it("should throw error, when async is not Async", function() {
            expect(loader.require.bind(loader)).to.throw(TypeError, "Async is expected");
        });

        it("should try read file with `fs`", function(done) {
            var fs, path;

            fs = require("fs");
            sinon.stub(fs, "readFile", function(path, cb) {
                cb(null, chance.word());
            });

            path = chance.word();

            loader
                .read(path, async)
                .then(function() {
                    var call;

                    expect(call = fs.readFile.getCall(0)).to.exist();
                    expect(call.calledWith(path)).to.be.true();
                })
                .then(done, done)
                .then(function() {
                    fs.readFile.restore();
                });
        });



        it("should try read file with normalized path", function(done) {
            var fs,  path, base, relative;

            fs = require("fs");
            sinon.stub(fs, "readFile", function(path, cb) {
                cb(null, chance.word());
            });

            path = chance.word();
            base = "/" + chance.word();
            relative = pathUtils.resolve(base, path);

            loader = new CJSLoader(adaptee, {
                base:    base,
                browser: false
            });

            loader
                .read(path, async)
                .then(function() {
                    var call;

                    expect(call = fs.readFile.getCall(0)).to.exist();
                    expect(call.calledWith(relative)).to.be.true();
                })
                .then(done, done)
                .then(function() {
                    fs.readFile.restore();
                });
        });

        it("should reject with error from `fs`", function(done) {
            var fs, error;

            error = new Error(chance.word());

            fs = require("fs");
            sinon.stub(fs, "readFile", function(path, cb) {
                cb(error);
            });

            loader
                .read(chance.word(), async)
                .then(function() {
                    done(new Error("Fulfilled, but expected to be rejected"));
                })
                .catch(function(err) {
                    expect(err).equal(error);
                })
                .then(done, done)
                .then(function() {
                    fs.readFile.restore();
                });
        });

        it("should resolve with text from `fs`", function(done) {
            var fs, text;

            text = chance.word();

            fs = require("fs");
            sinon.stub(fs, "readFile", function(path, cb) {
                cb(null, text);
            });

            loader
                .read(chance.word(), async)
                .then(function(result) {
                    expect(result).equal(text);
                })
                .then(done, done)
                .then(function() {
                    fs.readFile.restore();
                });
        });

    });

});