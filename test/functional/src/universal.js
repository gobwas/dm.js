var inherits = require("inherits-js"),
    _        = require("lodash"),
    sinon    = require("sinon"),
    UniversalService;

/**
 * @abstract
 * @class UniversalService
 * @constructor
 */
UniversalService = sinon.spy(function(options) {
    var self = this;

    this.options = _.extend({}, this.constructor.DEFAULTS, options || {});

    this.toString = sinon.spy(function() {
        return self.options.string;
    });
});

UniversalService.prototype = {
    constructor: UniversalService,

    method: sinon.spy()
};

UniversalService.extend = function(prots, statics) {
    return inherits(this, prots, statics);
};

UniversalService.DEFAULTS = {
    string: "I am instance"
};

module.exports = UniversalService;