var Builder         = require("../builder"),
    ServiceProvider = require("../../../provider/service"),
    _               = require("lodash"),
    ParameterBuilder;

/**
 * ParameterBuilder
 *
 * @class ParameterBuilder
 * @extends Builder
 * @author Sergey Kamardin <s.kamardin@tcsbank.ru>
 */
ParameterBuilder = Builder.extend(
    /**
     * @lends ParameterBuilder.prototype
     */
    {
        constructor: function(provider, options) {
            _.assert(provider instanceof ServiceProvider);

            Builder.prototype.constructor.call(this, options);

            this.provider = provider;
        },

        make: function(definition) {
            return this.provider.get(definition.name, definition.property, definition.args);
        }
    }
);

module.exports = ParameterBuilder;