var Builder           = require("../builder"),
    ParameterProvider = require("../../../provider/parameter"),
    _                 = require("lodash"),
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
            _.assert(provider instanceof ParameterProvider);

            Builder.prototype.constructor.call(this, options);

            this.provider = provider;
        },

        make: function(definition) {
            return this.provider.get(definition.name);
        }
    }
);

module.exports = ParameterBuilder;