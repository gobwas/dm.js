var test     = require("./../test"),
    Q        = require('rsvp'),
    QAdapter = require('../../../../src/dm/async/q');

test(Q, Q.Promise, QAdapter, {
    title: "QAsync"
});