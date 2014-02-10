import Async from "../async";

var RSVP = Async.extend({
    constructor: function() {
        Async.prototype.constructor.apply(this, arguments);
        this.RSVP = this.adaptee;
    },

    promise: function(resolver) {
        if (!resolver) throw new Error("Resolver function is expected");
        return new this.RSVP.Promise(resolver);
    },

    all: function(promises) {
        if (!promises) throw new TypeError("Array of promises is expected")
        return this.RSVP.all(promises)
    },

    resolve: function(value) {
        var deferred = this.RSVP.defer();
        deferred.resolve(value);
        return deferred.promise;
    },

    reject: function(value) {
        var deferred = this.RSVP.defer();
        deferred.reject(value);
        return deferred.promise;
    }
});

export default RSVP;