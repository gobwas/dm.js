var inherits = require("inherits-js"),
    _        = require("./utils"),
    Async    = require("./async"),
    Parser;

Parser = function(async, options) {
    _.assert(async instanceof Async, "Async is expected", TypeError);

    this.async = async;

    this.options = _.extend({}, this.constructor.DEFAULTS, options || {});
};

Parser.prototype = {
    constructor: Parser,

    /**
     * Tests given string to be parsed.
     *
     * @abstract
     * @param {string} str
     *
     * @returns {Promise|boolean}
     */
    test: function(str) {
        throw new Error("Method 'test' must be implemented");
    },

    /**
     * Parses string.
     * @abstract
     * @param {*} something
     *
     * @returns {Promise|*}
     */
    parse: function(something) {
        throw new Error("Method 'parse' must be implemented");
    }
};

Parser.extend = function(prots, statics) {
    return inherits(this, prots, statics);
};

Parser.DEFAULTS = {};

module.exports = Parser;