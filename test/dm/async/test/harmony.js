var test           = require("./../test"),
    HarmonyAdapter = require('../../../../src/dm/async/harmony'),
    RSVP           = require("rsvp");

test(RSVP.Promise, RSVP.Promise, HarmonyAdapter, {
    title: "harmony.js"
});