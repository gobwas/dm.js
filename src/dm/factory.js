var inherits = require("inherits-js"),
    _        = require("./utils"),
    Factory;

/**
 * @abstract
 * @class Factory
 * @constructor
 */
Factory = function(options) {
    this.options = _.extend({}, this.constructor.DEFAULTS, options || {});
};

Factory.prototype = {
    constructor: Factory,

    /**
     * Returns constructed object.
     *
     * @abstract
     *
     * @param {Object} definition
     *
     * @returns {Object|Promise}
     */
    factory: function(definition) {
        throw new Error("Method 'factory' must be implemented");
    }
};

Factory.extend = function(prots, statics) {
    return inherits(this, prots, statics);
};

Factory.DEFAULTS = {};

module.exports = Factory;