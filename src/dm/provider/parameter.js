var Provider = require("../provider"),
    _        = require("../utils"),
    ParameterProvider;

/**
 * ParameterProvider
 *
 * @class
 * @extends Provider
 */
ParameterProvider = Provider.extend(
    /**
     * @lends ParameterProvider.prototype
     */
    {
        make: function(attributes) {
            var dm = this.dm;

            return this.async.promise(function(resolve, reject) {
                dm
                    .parse(attributes.name)
                    .then(function(name) {
                        resolve(dm.getParameter(name));
                    })
                    .catch(reject);
            });
        }
    }
);

module.exports = ParameterProvider;