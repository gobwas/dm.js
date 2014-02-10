import Loader from "../loader";

var Requirejs = Loader.extend({
    constructor: function() {
        Loader.prototype.constructor.apply(this, arguments);
        this.requirejs = this.adaptee;
    },

    require: function(path) {
        var self = this;
        return this.async.promise(function(resolve, reject) {
            self.requirejs([path], resolve, reject);
        });
    }
});

export default Requirejs;