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
        get: function(definition) {
            var name, dm;

            _.assert(_.isObject(definition),             "Object is expected", TypeError);
            _.assert(_.isString(name = definition.name), "Definition.name is expected to be a string", TypeError);

            dm = this.dm;

            return dm
                .parse(name)
                .then(function(name) {
                    return dm.getParameter(name);
                });
        }
    }
);

module.exports = DefaultParameterProvider;