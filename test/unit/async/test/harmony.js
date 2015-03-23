var test           = require("./../test"),
    HarmonyAdapter = require('../../../../lib/async/harmony'),
    RSVP           = require("rsvp");

test(RSVP.Promise, RSVP.Promise, HarmonyAdapter, {
    title: "HarmonyAsync"
});