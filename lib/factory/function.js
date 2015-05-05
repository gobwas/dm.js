var Factory = require("../factory"),
    _      = require("../utils"),
    FunctionFactory;

/**
 * FunctionFactory
 *
 * Creates services from given function as factory.
 * Makes calls and sets properties on returned objects.
 *
 * @class
 * @extends Factory
 */
FunctionFactory = Factory.extend(
    /**
     * @lends FunctionFactory.prototype
     */
    {
        factory: function(definition) {
            var self = this,
                func, args, calls, properties, service;

            _.assert(_.isFunction(func = definition.operand), "Service factory is expected to be a Function", TypeError);

            if (!_.isUndefined(args = definition.arguments)) {
                _.assert(_.isArray(args), "Arguments is expected to be an Array", TypeError);
            }

            // Arguments
            service = func.apply(undefined, args);

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

module.exports = FunctionFactory;