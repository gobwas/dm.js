var _      = require('lodash'),
    chance = require('chance'),
    sinon  = require('sinon'),
    chai   = require('chai'),
    DM     = require('../../src/dm.js'),
    Loader = require('../../src/dm/loader'),
    Async  = require('../../src/dm/async'),
    RSVP   = require('rsvp'),
    assert, expect;

chance = new chance;
assert = chai.assert;
expect = chai.expect;

describe("DM", function() {

    describe("constructor", function() {

        it("should throw error when calling without `new`", function() {
            expect(DM).to.throw(Error, "Use constructor with the `new` operator");
        });

        it("should throw error when async is not given", function() {
            expect(function() { new DM() }).to.throw(TypeError, "Async is expected");
        });

        it("should throw error when loader is not given", function() {
            expect(function() { new DM(sinon.createStubInstance(Async)) }).to.throw(TypeError, "Loader is expected");
        });

        it("should throw error when options is not an Object", function() {
            expect(function() { new DM(sinon.createStubInstance(Async), sinon.createStubInstance(Loader), "bad") }).to.throw(TypeError, "Options is expected to be an Object");
        });

        it("should set default options for DM instance", function() {
            var dm;

            dm = new DM(sinon.createStubInstance(Async), sinon.createStubInstance(Loader));

            expect(dm.options).to.be.an.instanceOf(Object);

            _.forEach(DM.DEFAULTS, function(value, key) {
                expect(dm.options).to.have.property(key).that.equals(value);
            });
        });

    });

    describe("instance", function() {

        before(function() {
            console.log('before!');
        });

        describe("#setConfig", function() {

        });

        describe("#getConfig", function() {

        });

        describe("#setParameters", function() {

        });

        describe("#setParameter", function() {

        });

        describe("#getParameter", function() {

        });

    })

});