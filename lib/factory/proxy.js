var Factory = require("../factory"),
    _      = require("../utils"),
    ProxyFactory;

/**
 * ProxyFactory
 *
 * Returns given operand.
 * Sets properties, and make calls on it (if possible).
 *
 * Use carefully this factory, cause it makes changes to the cached exported object.
 *
 * @class
 * @extends Factory
 */
ProxyFactory = Factory.extend(
    /**
     * @lends ProxyFactory.prototype
     */
    {
        factory: function(definition) {
            var self = this,
                calls, properties, service;

            service = definition.operand;

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

module.exports = ProxyFactory;