var inherits = require("inherits-js"),
    _        = require("lodash"),
    sinon    = require("sinon"),
    ServiceA;

/**
 * @abstract
 * @class ServiceA
 * @constructor
 */
ServiceA = function(options) {
    this.options = _.extend({}, this.constructor.DEFAULTS, options || {});
};

ServiceA.prototype = {
    constructor: ServiceA,

    textA: sinon.spy(),

    textB: sinon.spy(),

    textC: sinon.spy()
};

ServiceA.extend = function(prots, statics) {
    return inherits(this, prots, statics);
};

ServiceA.DEFAULTS = {};

module.exports = ServiceA;