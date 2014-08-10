var test          = require("./../test"),
    BroodyPromise = require('broody-promises'),
    BroodyAdapter = require('../../../../../src/dm/adapter/async/broody');

test(BroodyPromise, BroodyPromise, BroodyAdapter, {
    title: "broody.js"
});