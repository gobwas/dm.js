var _        = require("lodash"),
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
        all:   null,
        match: null
    };
};

Template.DEFAULTS = {};

Template.prototype = {
    constructor: Template,

    all: function(str) {
        var cached, match;

        if (!(cached = this.cache.all[str])) {
            cached = [];

            while ((match = this.constructor.REGEXP.exec(str))) {
                cached.push(this.result(match));
            }

            this.constructor.REGEXP.lastIndex = 0;

            this.cache.all[str] = cached;
        }

        return cached;
    },

    match: function(str) {
        var cached;

        if (!(cached = this.cache.match[str])) {
            cached = this.cache.match[str] = this.result(this.constructor.REGEXP.exec(str));
            this.constructor.REGEXP.lastIndex = 0;
        }

        return cached;
    },

    test: function(str) {
        return !!this.match(str);
    },

    /**
     * @abstract
     * @param match
     */
    result: function(match) {
        return _.extend({ match: match[0], definition: this.define(match) });
    },

    /**
     * @abstract
     */
    define: function(match) {
        throw new Error("Method 'define' must be implemented");
    }
};

Template.extend = function(prots, statics) {
    return inherits(this, prots, statics);
};

module.exports = Template;
