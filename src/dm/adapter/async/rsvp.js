import Async from "./async";

var RSVP = Async.extend({
    constructor: function() {
        Async.prototype.constructor.apply(this, arguments);
        this.RSVP = this.adaptee;
    },

    promise: function(actor) {
        return new this.RSVP.Promise(actor);
    },

    all: function(promises) {
        return this.RSVP.all(promises)
    },

    resolve: function(obj) {
        var deferred = this.RSVP.defer();

        return deferred.resolve(obj).promise;
    },

    reject: function(obj) {
        var deferred = this.RSVP.defer();
        return deferred.reject(obj).promise;
    }
});

export default RSVP;