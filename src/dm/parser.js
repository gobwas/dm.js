var inherits = require("inherits-js"),
    utils    = require("./utils"),
    Async    = require("./async"),
    extend   = utils.extend,
    Parser;

Parser = function(async, options) {
    if (!(async instanceof Async)) {
        throw new TypeError("Async is expected");
    }

    this.async = async;

    this.options = extend({}, this.constructor.DEFAULTS, options || {});
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
     * @param {string} str
     *
     * @returns {Promise|*}
     */
    parse: function(str) {
        throw new Error("Method 'parse' must be implemented");
    }
};

Parser.extend = function(prots, statics) {
    return inherits(this, prots, statics);
};

Parser.DEFAULTS = {};

module.exports = Parser;