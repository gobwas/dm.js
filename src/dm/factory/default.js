var Factory = require("../factory"),
    utils   = require("../../dm/utils"),

    isFunction    = utils.isFunction,
    forEachOwn    = utils.forEachOwn,
    forEachSimple = utils.forEachSimple;


module.exports = Factory.extend({
    newInstanceWithArgs: function(constructor, args) {
        var service;

        function Service() {}
        Service.prototype = constructor.prototype;

        service = new Service();

        try {
            constructor.apply(service, args);
        } catch (error) {
            console.error("Cannot instantiate service", error);
            throw error;
        }

        return service;
    },

    makeCall: function(service, method, args) {
        if (isFunction(service[method])) {
            service[method].apply(service, args);
        }
    },

    setProperty: function(service, property, value) {
        service[property] = value;
    },

    factory: function(definition) {
        var self = this,
            service;

        // Arguments
        service = this.newInstanceWithArgs(definition.constructor, definition.arguments);

        // Calls
        forEachSimple(definition.calls, function(call) {
            self.makeCall(service, call[0], call[1]);
        });

        // Properties
        forEachOwn(definition.properties, function(value, property) {
            self.setProperty(service, property, value);
        });


        return service;
    }
});