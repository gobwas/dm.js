var test     = require("./../test"),
    Q        = require('rsvp'),
    QAdapter = require('../../../../../src/dm/adapter/async/q');

test(Q, Q.Promise, QAdapter, {
    title: "q.js"
});