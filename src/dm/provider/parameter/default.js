var ParameterProvider = require("../parameter"),
    _                 = require("../../utils"),
    DefaultParameterProvider;

/**
 * DefaultParameterProvider
 *
 * @class DefaultParameterProvider
 * @extends ParameterProvider
 * @author Sergey Kamardin <s.kamardin@tcsbank.ru>
 */
DefaultParameterProvider = ParameterProvider.extend(
    /**
     * @lends DefaultParameterProvider.prototype
     */
    {
        get: function(name) {
            var dm = this.dm;

            return this.async.promise(function(resolve, reject) {
                dm
                    .parse(name)
                    .then(function(name) {
                        resolve(dm.getParameter(name));
                    })
                    .catch(reject);
            });
        }
    }
);

module.exports = DefaultParameterProvider;