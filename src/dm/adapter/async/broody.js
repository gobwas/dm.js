var Async = require("../async"),
    BroodyPromise;

BroodyPromise = Async.extend({
    constructor: function() {
        Async.prototype.constructor.apply(this, arguments);
        this.BroodyPromise = this.adaptee;
    },

    promise: function(resolver) {
        return new this.BroodyPromise(resolver);
    },

    all: function(promises) {
        return this.BroodyPromise.all(promises);
    },

    resolve: function(value) {
        return this.BroodyPromise.resolve(value);
    },

    reject: function(error) {
        return this.BroodyPromise.reject(error);
    }
});

module.exports = BroodyPromise;