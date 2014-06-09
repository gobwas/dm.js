var Adapter = require("../adapter"),
    Async;

Async = Adapter.extend({
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
    }
});


module.exports = Async;