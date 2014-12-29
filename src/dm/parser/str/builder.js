var _        = require("lodash"),
    inherits = require("inherits-js"),
    Builder;

/**
 * Builder
 *
 * @class Builder
 * @constructor
 * @abstract
 *
 * @param {Object} [options]
 *
 * @author Sergey Kamardin <s.kamardin@tcsbank.ru>
 */
Builder = function(options) {
    this.options = _.extend({}, this.constructor.DEFAULTS, options);
};

Builder.DEFAULTS = {};

Builder.prototype = {
    constructor: Builder,

    build: function(match) {
        //
    }
};

Builder.extend = function(prots, statics) {
    return inherits(this, prots, statics);
};

module.exports = Builder;