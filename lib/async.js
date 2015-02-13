var inherits = require("inherits-js"),
    Async;

Async = function(adaptee) {
    this.adaptee = adaptee;
};

Async.prototype = {
    constructor: Async,

    /**
     * Creates new Promise with given resolver.
     *
     * @param {Function} resolver
     */
    promise: function(resolver) {
        throw new Error("Method 'promise' must be implemented");
    },

    /**
     * Creates new Promise, that waiting for all given promises/values is resolved.
     *
     * @param {Array} list
     */
    all: function(list) {
        throw new Error("Method 'all' must be implemented");
    },

    /**
     * Creates new resolved with given value Promise.
     *
     * @param {*} value
     */
    resolve: function(value) {
        throw new Error("Method 'resolve' must be implemented");
    },

    /**
     * Creates new rejected with given value Promise.
     *
     * @param {*} value
     */
    reject: function(value) {
        throw new Error("Method 'reject' must be implemented");
    },

    /**
     * Universal defer function.
     * Could be overriden by async implementors.
     *
     * @returns {Object}
     */
    defer: function() {
        var deferred;

        deferred = {};

        deferred.promise = this.promise(function(resolve, reject) {
            deferred.resolve = resolve;
            deferred.reject  = reject;
        });

        return deferred;
    }
};

Async.extend = function(prots, statics) {
    return inherits(this, prots, statics);
};

module.exports = Async;