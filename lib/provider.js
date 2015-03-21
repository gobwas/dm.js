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
    _.assert(_.isObject(dm),         "Object is expected", TypeError);
    _.assert(async instanceof Async, "Async is expected",  TypeError);

    this.dm = dm;
    this.async = async;
    this.options = _.extend({}, this.constructor.DEFAULTS, options || {});
};

Provider.prototype = {
    constructor: Provider,

    /**
     * @abstract
     * @param {Object} attributes
     * @return {Promise}
     */
    get: function(attributes) {
        throw new Error("Method 'get' must be implemented");
    }
};

Provider.extend = function(prots, statics) {
    return inherits(this, prots, statics);
};

Provider.DEFAULTS = {};

module.exports = Provider;