var inherits = require("inherits-js"),
    utils    = require("./utils"),
    Async    = require("./async"),
    Provider = require("./provider"),
    extend   = utils.extend,
    Parser;

Parser = function(async, options) {
    if (!(async instanceof Async)) {
        throw new Error("Async is expected");
    }

    this.async    = async;

    this.options = extend({}, this.constructor.DEFAULTS, options || {});
};

Parser.prototype = {
    constructor: Parser,

    injectProvider: function(provider) {
        if (!(provider instanceof Provider)) {
            throw new TypeError("Provider is expected");
        }

        if (this.provider) {
            throw new Error("Provider is already set");
        }

        this.provider = provider;

        return this;
    },

    test: function(str) {
        throw new Error("Method 'test' must be implemented");
    },

    parse: function(str) {
        throw new Error("Method 'parse' must be implemented");
    }
};

Parser.extend = function(prots, statics) {
    return inherits(this, prots, statics);
};

Parser.DEFAULTS = {};

module.exports = Parser;