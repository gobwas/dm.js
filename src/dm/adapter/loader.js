import Adapter from "../adapter";
import Async from "./async";

var Loader = Adapter.extend({
    /**
     *
     * @param adapter
     */
    setAsync: function(adapter) {
        if (!adapter instanceof Async) throw new Error("Async is expected");
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


export default Loader;