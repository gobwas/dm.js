var test          = require("./../test"),
    BroodyPromise = require("broody-promises"),
    BroodyAdapter = require("../../../../lib/async/broody");

test(BroodyPromise, BroodyPromise, BroodyAdapter, {
    title: "BroodyPromisesAsync"
});