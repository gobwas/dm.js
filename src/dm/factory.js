var inherits = require("inherits-js"),
    Factory;

Factory = function() {
    //
};

Factory.prototype = {
    constructor: Factory,

    /**
     *
     * @param definition
     *
     * @returns {Object|Promise}
     */
    factory: function(definition) {
        throw new Error("Method must be implemented");
    }
};

Factory.extend = function(prots, statics) {
    return inherits(this, prots, statics);
};


module.exports = Factory;