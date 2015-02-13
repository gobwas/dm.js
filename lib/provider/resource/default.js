var ResourceProvider = require("../resource"),
    _                = require("../../utils"),
    DefaultResourceProvider;

/**
 * DefaultResourceProvider
 *
 * @class DefaultResourceProvider
 * @extends ResourceProvider
 * @author Sergey Kamardin <s.kamardin@tcsbank.ru>
 */
DefaultResourceProvider = ResourceProvider.extend(
    /**
     * @lends DefaultResourceProvider.prototype
     */
    {
        get: function(definition) {
            var self = this,
                path, handler, promises;

            _.assert(_.isObject(definition), "Object is expected", TypeError);

            _.assert(_.isString(path = definition.path), "Definition.path is expected to be a string", TypeError);

            if (!_.isUndefined(handler = definition.handler)) {
                _.assert(_.isString(handler), "Definition.handler is expected to be a string", TypeError);
            }

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

module.exports = DefaultResourceProvider;