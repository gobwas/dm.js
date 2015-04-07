var LoadProvider = require("../load"),
    _            = require("../../utils"),
    SimpleLoadProvider;

/**
 * SimpleLoadProvider
 *
 * @class
 * @extends LoadProvider
 */
SimpleLoadProvider = LoadProvider.extend(
    /**
     * @lends SimpleLoadProvider.prototype
     */
    {
        /**
         *
         * @param {Object} definition
         * @param {string} definition.path
         */
        get: function(definition) {
            var path, pointer;

            _.assert(_.isObject(definition), "Object is expected", TypeError);
            _.assert(_.isString(path = definition.path), "Definition.path is expected to be a string", TypeError);

            return this.loader.require(definition.path, this.async);
        }
    }
);

module.exports = SimpleLoadProvider;