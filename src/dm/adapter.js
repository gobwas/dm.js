import inherits from "./inherits";

var Adapter = function(adaptee) {
    this.adaptee = adaptee;
};

Adapter.extend = function(prototypeProperties, staticProperties) {
    return inherits(this, prototypeProperties, staticProperties);
};

export default Adapter;