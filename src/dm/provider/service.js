var Provider = require("../provider"),
    _        = require("../utils"),
    ServiceProvider;

/**
 * ServiceProvider
 *
 * @class
 * @extends Provider
 */
ServiceProvider = Provider.extend(
    /**
     * @lends ServiceProvider.prototype
     */
    {
        make: function(attributes) {
            var self = this,
                name, property, args,
                promises;

            name     = attributes.name;
            property = attributes.property;
            args     = attributes.args;

            promises = [this.dm.parse(name)];

            if (property && _.isString(property)) {
                promises.push(this.dm.parse(property));

                if (args) {
                    try {
                        args = JSON.parse(args[3]);
                    } catch (err) {
                        return this.async.reject(new Error("Service method call parse error"));
                    }

                    args = _.map(args, this.dm.parse, this.dm);

                    promises.push(this.async.all(args));
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
                })

        }
    }
);

module.exports = ServiceProvider;