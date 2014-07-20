var inherits = require("inherits-js"),
    Adapter;

Adapter = function(adaptee) {
    this.adaptee = adaptee;
};

Adapter.extend = function(prots, statics) {
    return inherits(this, prots, statics);
};

module.exports = Adapter;