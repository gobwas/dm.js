var inherits = require("inherits-js"),
    _        = require("./utils"),
    Async    = require("./async"),
    Loader;

/**
 * Loader.
 *
 * @abstract
 * @class Loader
 * @constructor
 */
Loader = function(adaptee, options) {
    this.adaptee = adaptee;
    this.options = _.extend({}, this.constructor.DEFAULTS, options || {});
};

Loader.prototype = {
    constructor: Loader,

    /**
     * Requires a module.
     *
     * @abstract
     * @param {string} path
     * @param {Async}  async
     * @param {Object} [options]
     */
    require: function(path, async, options) {
        throw new Error("Method must be implemented");
    },

    /**
     * Loads resource.
     *
     * @abstract
     * @param {string} path
     * @param {Async}  async
     * @param {Object} [options]
     */
    read: function(path, async, options) {
        throw new Error("Method must be implemented");
    }
};

Loader.extend = function(prots, statics) {
    return inherits(this, prots, statics);
};

Loader.DEFAULTS = {};

module.exports = Loader;