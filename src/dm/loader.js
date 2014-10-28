var inherits = require("inherits-js"),
    Async    = require("./async"),
    Loader;

Loader = function(adaptee) {
    this.adaptee = adaptee;
};

Loader.prototype = {
    constructor: Loader,

    /**
     * Injects async adapter.
     *
     * @param {Async} adapter
     */
    setAsync: function(adapter) {
        if (!adapter instanceof Async) {
            throw new Error("Async is expected");
        }

        this.async = adapter;

        return this;
    },

    /**
     * Requires a module.
     *
     * @param {string} path
     * @param {Object} options
     */
    require: function(path, options) {
        throw new Error("Method must be implemented");
    },

    /**
     * Loads resource.
     *
     * @param {string} path
     * @param {Object} options
     */
    read: function(path, options) {
        throw new Error("Method must be implemented");
    }
};

Loader.extend = function(prots, statics) {
    return inherits(this, prots, statics);
};

module.exports = Loader;