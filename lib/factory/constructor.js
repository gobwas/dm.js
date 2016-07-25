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
        factory: function(definition) {
            var self = this,
                ctor, args, calls, properties, service;

            _.assert(_.isFunction(ctor = definition.operand), "Service constructor is expected to be a Function", TypeError);

            if (!_.isUndefined(args = definition.arguments)) {
                _.assert(_.isArray(args), "Arguments is expected to be an Array", TypeError);
            }

            // Arguments
            service = _.construct(ctor, args);

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