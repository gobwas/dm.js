var Adapter = require("../adapter"),
    Async = require("./async"),
    Loader;

Loader = Adapter.extend({
    /**
     *
     * @param adapter
     */
    setAsync: function(adapter) {
        if (!adapter instanceof Async) {
            throw new Error("Async is expected");
        }

        this.async = adapter;

        return this;
    },

    /**
     *
     * @param {Function} actor
     */
    require: function(path) {
        throw new Error("Method must be implemented");
    }
});


module.exports = Loader;