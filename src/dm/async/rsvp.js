var Async = require("../async"),
    RSVP;

RSVP = Async.extend({
    constructor: function() {
        Async.prototype.constructor.apply(this, arguments);
        this.RSVP = this.adaptee;
    },

    promise: function(resolver) {
        return new this.RSVP.Promise(resolver);
    },

    all: function(promises) {
        return this.RSVP.all(promises);
    },

    resolve: function(value) {
        return this.RSVP.Promise.resolve(value);
    },

    reject: function(error) {
        return this.RSVP.Promise.reject(error);
    }
});

module.exports = RSVP;