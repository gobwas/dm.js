var Async = require("../async"),
    Q;

Q = Async.extend({
    constructor: function() {
        Async.prototype.constructor.apply(this, arguments);
        this.Q = this.adaptee;
    },

    promise: function(resolver) {
        return new this.Q.Promise(resolver);
    },

    all: function(promises) {
        return this.Q.all(promises);
    },

    resolve: function(value) {
        return this.Q.Promise.resolve(value);
    },

    reject: function(error) {
        return this.Q.Promise.reject(error);
    }
});

module.exports = Q;