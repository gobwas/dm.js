var test          = require("./../test"),
    BroodyPromise = require("broody-promises"),
    BroodyAdapter = require("../../../../src/dm/async/broody");

test(BroodyPromise, BroodyPromise, BroodyAdapter, {
    title: "BroodyPromisesAsync"
});