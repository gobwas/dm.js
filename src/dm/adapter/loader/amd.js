var Loader = require("../loader"),
    Requirejs;

Requirejs = Loader.extend({
    constructor: function() {
        Loader.prototype.constructor.apply(this, arguments);
        this.requirejs = this.adaptee;
    },

    require: function(path) {
        var self = this;
        return this.async.promise(function(resolve, reject) {
            self.requirejs([path], resolve, reject);
        });
    },

    read: function(path, options) {
        var self = this;

        options = options || {};

        return this.async.promise(function(resolve, reject) {
            self.requirejs([[options.handler || "text", path].join('!')], resolve, reject);
        });
    }
});

module.exports = Requirejs;