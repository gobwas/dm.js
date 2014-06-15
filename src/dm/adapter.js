var inherits = require("inherits-js"),
    Adapter;

Adapter = function(adaptee) {
    this.adaptee = adaptee;
};

Adapter.extend = function(prototypeProperties, staticProperties) {
    return inherits(this, prototypeProperties, staticProperties);
};

module.exports = Adapter;