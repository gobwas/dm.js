var test        = require("./../test"),
    RSVP        = require('rsvp'),
    RSVPAdapter = require('../../../../src/dm/async/rsvp');

test(RSVP, RSVP.Promise, RSVPAdapter, {
    title: "RSVPAsync"
});