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
    },

    /**
     * @protected
     * @param {Object} object
     * @param {string} method
     * @param {Array}  args
     */
    makeCall: function(object, method, args) {
        _.assert(_.isObjectLike(object),       "Trying to call method of non object", TypeError);
        _.assert(_.isFunction(object[method]), "Trying to call method that does not exists: '" + method + "'", Error);
        object[method].apply(object, args);
    },

    /**
     * @protected
     * @param {Object} object
     * @param {string} property
     * @param {*}      value
     */
    setProperty: function(object, property, value) {
        _.assert(_.isObjectLike(object), "Trying to set property of non object", TypeError);
        object[property] = value;
    },
};

Factory.extend = function(prots, statics) {
    return inherits(this, prots, statics);
};

Factory.DEFAULTS = {};

module.exports = Factory;