var Builder           = require("../builder"),
    ResourceProvider = require("../../../provider/resource"),
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
            _.assert(provider instanceof ResourceProvider);

            Builder.prototype.constructor.call(this, options);

            this.provider = provider;
        },

        make: function(definition) {
            return this.provider.get(definition.path, definition.handler);
        }
    }
);

module.exports = ParameterBuilder;