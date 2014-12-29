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
        get: function(path, handler) {
            var self = this,
                promises;

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