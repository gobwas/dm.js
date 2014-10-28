var inherits = require("inherits-js"),
    _        = require("./utils"),
    Async    = require("./async"),
    Provider;

/**
 * @abstract
 * @class Provider
 * @constructor
 */
Provider = function(dm, async, options) {
//    Avoid circular dependency
//    if (!(dm instanceof require("../dm"))) {
//        throw new TypeError("DependencyManager is expected");
//    }

    if (!(async instanceof Async)) {
        throw new TypeError("Async is expected");
    }

    this.dm    = dm;
    this.async = async;

    this.options = _.extend({}, this.constructor.DEFAULTS, options || {});
};

Provider.prototype = {
    constructor: Provider,

    make: function(attributes) {
        throw new Error("Method 'make' must be implemented");
    }
};

Provider.extend = function(prots, statics) {
    return inherits(this, prots, statics);
};

Provider.DEFAULTS = {};

module.exports = Provider;