var _        = require("../../utils"),
    inherits = require("inherits-js"),
    Template;

/**
 * Template
 *
 * @class Template
 * @constructor
 * @abstract
 *
 * @param {Object} [options]
 *
 * @author Sergey Kamardin <s.kamardin@tcsbank.ru>
 */
Template = function(options) {
    this.options = _.extend({}, this.constructor.DEFAULTS, options);
    this.cache = {
        all:   {},
        match: {}
    };
};

Template.DEFAULTS = {};

Template.prototype = {
    constructor: Template,

    all: function(str) {
        var cached, match, REGEXP;

        if (!(cached = this.cache.all[str])) {
            cached = [];

            REGEXP = this.constructor.REGEXP;

            do {
                if ((match = REGEXP.exec(str))) {
                    cached.push(this.result(match));
                }
            } while (REGEXP.global && match);

            // reset regexp
            this.constructor.REGEXP.lastIndex = 0;

            // cache results
            this.cache.all[str] = cached;
        }

        return cached;
    },

    match: function(str) {
        var cached, match;

        if (!(cached = this.cache.match[str])) {
            if ((cached = match = this.constructor.REGEXP.exec(str))) {
                // if found some, wrap it in spec
                cached = this.result(match);
            }

            // reset regexp
            this.constructor.REGEXP.lastIndex = 0;

            // cache anyway
            this.cache.match[str] = cached;
        }

        return cached;
    },

    test: function(str) {
        return !!this.match(str);
    },

    /**
     * @private
     * @param match
     */
    result: function(match) {
        var matchedString, lastIndex;

        matchedString = match[0];
        lastIndex = this.constructor.REGEXP.lastIndex - 1;

        return {
            match: {
                string:   matchedString,
                position: [lastIndex - matchedString.length + 1, lastIndex]
            },
            definition: this.define(match)
        };
    },

    /**
     * @abstract
     * @protected
     */
    define: function(match) {
        throw new Error("Method 'define' must be implemented");
    }
};

Template.extend = function(prots, statics) {
    return inherits(this, prots, statics);
};

module.exports = Template;
