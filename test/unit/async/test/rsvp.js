var test        = require("./../test"),
    RSVP        = require('rsvp'),
    RSVPAdapter = require('../../../../lib/async/rsvp');

test(RSVP, RSVP.Promise, RSVPAdapter, {
    title: "RSVPAsync"
});