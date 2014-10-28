var Provider = require("../provider"),
    _        = require("../utils"),
    ResourceProvider;

/**
 * ResourceProvider
 *
 * @class
 * @extends Provider
 */
ResourceProvider = Provider.extend(
    /**
     * @lends ResourceProvider.prototype
     */
    {
        make: function(attributes) {
            var self = this,
                path, handler,
                promises;

            path    = attributes.path;
            handler = attributes.handler;

            promises = [this.dm.parse(path)];

            if (handler && _.isString(handler)) {
                promises.push(this.dm.parse(handler));
            }

            return this.async
                .all(promises)
                .then(function(args) {
                    return self.dm.getResource.apply(self.dm, args);
                });
        }
    }
);

module.exports = ResourceProvider;