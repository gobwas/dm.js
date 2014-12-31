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
        get: function(definition) {
            var self = this,
                name, property, args, promises;

            _.assert(_.isString(name = definition.name),         "Expected definition.name to be a string");
            _.assert(_.isString(property = definition.property), "Expected definition.property to be a string");
            _.assert(_.isArray(args = definition.args),          "Expected definition.path to be a Array");

            promises = [this.dm.parse(name)];

            if (property && _.isString(property)) {
                promises.push(this.dm.parse(property));

                if (args) {
                    promises.push(this.async.all(_.map(args, this.dm.parse, this.dm)));
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

                            if (isString(prop)) {
                                property = service[prop];
                                isFunc = _.isFunction(property);

                                if (_.isArray(args)) {
                                    if (!isFunc) {
                                        throw new TypeError(_.sprintf("Service '%s' does not have the method '%s'", key, prop));
                                    }


                                    return property.apply(service, options.arguments);
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