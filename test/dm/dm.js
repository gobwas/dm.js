var _      = require('lodash'),
    chance = require('chance'),
    sinon  = require('sinon'),
    chai   = require('chai'),
    DM     = require('../../src/dm.js'),
    Loader = require('../../src/dm/loader'),
    Async  = require('../../src/dm/async'),
    RSVP   = require('rsvp'),
    assert;

chance = new chance;
assert = chai.assert;

//describe("#dm.js", function() {
//    var dm;
//
//    beforeEach(function() {
//        dm = new DM();
//    });
//
//    describe("#constructor", function() {
//
//        it("Should set default options for DM instance", function() {
//            assert.isObject(dm.options);
//            return _.forEach(dm.options, function(val, key) {
//                return assert.strictEqual(val, DM.DEFAULTS[key]);
//            });
//        });
//
//    });
//
//});