var inherits = require("inherits-js"),
    _        = require("lodash"),
    sinon   = require("sinon"),
    ServiceB;

/**
 * @abstract
 * @class ServiceB
 * @constructor
 */
ServiceB = function(options) {
    this.options = _.extend({}, this.constructor.DEFAULTS, options || {});
};

ServiceB.prototype = {
    constructor: ServiceB,

    toString: sinon.spy(function() {
        return "I am serviceB instance";
    })
};

ServiceB.extend = function(prots, statics) {
    return inherits(this, prots, statics);
};

ServiceB.DEFAULTS = {};

module.exports = ServiceB;