var LoadProvider = require("../load"),
    _              = require("../../utils"),
    jsonPointer    = require("json-pointer"),
    JSONPointerLoadProvider;

/**
 * JSONPointerLoadProvider
 *
 * @class
 * @extends LoadProvider
 */
JSONPointerLoadProvider = LoadProvider.extend(
    /**
     * @lends JSONPointerLoadProvider.prototype
     */
    {
        /**
         *
         * @param {Object} definition
         * @param {string} definition.path
         * @param {string} definition.pointer
         */
        get: function(definition) {
            var path, pointer;

            _.assert(_.isObject(definition), "Object is expected", TypeError);
            _.assert(_.isString(path = definition.path), "Definition.path is expected to be a string", TypeError);
            _.assert(_.isString(pointer = definition.pointer), "Definition.pointer is expected to be a string", TypeError);

            return this.loader.require(definition.path, this.async)
                .then(function(obj) {
                    try {
                        return jsonPointer.get(obj, definition.pointer);
                    } catch (err) {
                        throw new SyntaxError("Could not apply JSON pointer: " + err.message);
                    }
                });
        }
    }
);

module.exports = JSONPointerLoadProvider;