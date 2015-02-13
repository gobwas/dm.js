var test     = require("./../test"),
    Q        = require('rsvp'),
    QAdapter = require('../../../../lib/async/q');

test(Q, Q.Promise, QAdapter, {
    title: "QAsync"
});