var inherits = require("inherits-js"),
    _        = require("lodash"),
    Klass;

/**
 * @abstract
 * @class Klass
 * @constructor
 */
Klass = function(options) {
    this.options = _.extend({}, this.constructor.DEFAULTS, options || {});
};

Klass.prototype = {
    constructor: Klass
};

Klass.extend = function(prots, statics) {
    return inherits(this, prots, statics);
};

Klass.DEFAULTS = {};

module.exports = Klass;