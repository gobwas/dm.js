var Factory = require("../factory"),
    _       = require("../utils"),
    DefaultFactory;

/**
 * DefaultFactory
 *
 * @class
 * @extends Factory
 */
DefaultFactory = Factory.extend(
    /**
     * @lends DefaultFactory.prototype
     */
    {
        /**
         * Creates object.
         *
         * @see http://jsperf.com/dynamic-arguments-to-the-constructor/4
         *
         * @private
         * @param {Object} prototype
         *
         * @return {Object}
         */
        createObject: (function() {
            if (_.isFunction(Object.create)) {
                return function(prototype) {
                    return Object.create(prototype);
                };
            }

            // we wrap here in immediate invoked function expression
            // to avoid hoisting of the fake constructor function `Service`
            return (function() {
                // fake constructor
                function Service(){}

                return function(prototype) {
                    Service.prototype = prototype;
                    return new Service();
                };
            })();
        })(),

        /**
         * @private
         * @param constructor
         * @param args
         */
        newInstanceWithArgs: function(constructor, args) {
            var that, service;

            that = this.createObject(constructor.prototype);

            try {
                service = constructor.apply(that, args);
            } catch (error) {
                //console.error("Cannot instantiate service", error);
                throw error;
            }

            return service && (typeof service == 'object' || typeof service == 'function') ? service : that;
        },

        /**
         * @private
         * @param service
         * @param method
         * @param args
         */
        makeCall: function(service, method, args) {
            _.assert(_.isFunction(service[method]), "Try to call method does not exists: '" + method + "'", Error);
            service[method].apply(service, args);
        },

        /**
         * @private
         * @param service
         * @param property
         * @param value
         */
        setProperty: function(service, property, value) {
            service[property] = value;
        },

        factory: function(definition) {
            var self = this,
                ctor, args, calls, properties, service;

            _.assert(_.isFunction(ctor = definition.constructor), "Constructor is expected to be a Function", TypeError);

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

module.exports = DefaultFactory;