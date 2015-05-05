var Factory = require("../factory"),
    _       = require("../utils"),
    ConstructorFactory;

/**
 * ConstructorFactory
 *
 * Creates services as classic OOP objects.
 * Instantiates object, makes calls and sets properties.
 *
 * @class
 * @extends Factory
 */
ConstructorFactory = Factory.extend(
    /**
     * @lends ConstructorFactory.prototype
     */
    {
        /**
         * @private
         * @param constructor
         * @param args
         */
        newInstanceWithArgs: function(constructor, args) {
            var that, service;

            that = _.createObject(constructor.prototype);

            try {
                service = constructor.apply(that, args);
            } catch (error) {
                //console.error("Cannot instantiate service", error);
                throw error;
            }

            return service && (typeof service == 'object' || typeof service == 'function') ? service : that;
        },

        factory: function(definition) {
            var self = this,
                ctor, args, calls, properties, service;

            _.assert(_.isFunction(ctor = definition.operand), "Service constructor is expected to be a Function", TypeError);

            if (!_.isUndefined(args = definition.arguments)) {
                _.assert(_.isArray(args), "Arguments is expected to be an Array", TypeError);
            }

            // Arguments
            service = this.newInstanceWithArgs(ctor, args);

            // Calls
            if (_.isArray(calls = definition.calls)) {
                _.forEach(calls, function(call) {
                    self.makeCall(service, call[0], call[1]);
                });
            }

            // Properties
            if (_.isObject(properties = definition.properties)) {
                _.forEach(properties, function(value, property) {
                    self.setProperty(service, property, value);
                });
            }

            return service;
        }
    }
);

module.exports = ConstructorFactory;