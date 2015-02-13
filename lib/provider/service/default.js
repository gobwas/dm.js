var ServiceProvider = require("../service"),
    _               = require("../../utils"),
    DefaultServiceProvider;

/**
 * DefaultServiceProvider
 *
 * @class DefaultServiceProvider
 * @extends ServiceProvider
 * @author Sergey Kamardin <s.kamardin@tcsbank.ru>
 */
DefaultServiceProvider = ServiceProvider.extend(
    /**
     * @lends DefaultServiceProvider.prototype
     */
    {
        /**
         * Returns service promise.
         *
         * @param {Object} definition
         * @param {string} definition.name
         * @param {string} [definition.property]
         * @param {Array}  [definition.args]
         *
         * @returns {Promise}
         */
        get: function(definition) {
            var self = this,
                name, property, args, promises;

            _.assert(_.isObject(definition), "Object is expected", TypeError);

            name     = definition.name;
            property = definition.property;
            args     = definition.args;

            _.assert(_.isString(name), "Definition.name is expected to be a string", TypeError);

            if (!_.isUndefined(property)) {
                _.assert(_.isString(property = definition.property), "Definition.property is expected to be a string", TypeError);
            }

            if (!_.isUndefined(args)) {
                _.assert(_.isArray(args = definition.args), "Definition.args is expected to be an Array", TypeError);
            }

            promises = [this.dm.parse(name)];

            if (property && _.isString(property)) {
                promises.push(this.dm.parse(property));

                if (args) {
                    promises.push(this.async.all(_.map(args, function(argument) {
                        return self.dm.parse(argument);
                    })));
                }
            }

            return this.async.all(promises)
                .then(function(results) {
                    var key, prop, args;

                    key  = results[0];
                    prop = results[1];
                    args = results[2];

                    return self.dm
                        .get(key)
                        .then(function(service) {
                            var property, isFunc;

                            if (_.isString(prop)) {
                                if (_.isUndefined(property = service[prop])) {
                                    throw new TypeError(_.sprintf("Service '%s' does not have the property '%s'", key, prop));
                                }

                                isFunc = _.isFunction(property);

                                if (_.isArray(args)) {
                                    if (!isFunc) {
                                        throw new TypeError(_.sprintf("Service '%s' does not have the method '%s'", key, prop));
                                    }

                                    return property.apply(service, args);
                                }

                                return isFunc ? _.bind(property, service) : property;
                            }

                            return service;
                        });
                });

        }
    }
);

module.exports = DefaultServiceProvider;