import Adapter from "../adapter";

var Async = Adapter.extend({
    /**
     *
     * @param {Function} actor
     */
    promise: function(resolver) {
        throw new Error("Method 'promise' must be implemented");
    },

    /**
     *
     * @param {Array} list
     */
    all: function(list) {
        throw new Error("Method 'all' must be implemented");
    },

    /**
     *
     * @param {*} value
     */
    resolve: function(value) {
        throw new Error("Method 'resolve' must be implemented");
    },

    /**
     *
     * @param {*} value
     */
    reject: function(value) {
        throw new Error("Method 'reject' must be implemented");
    }
});


export default Async;