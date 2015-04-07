var Template = require("../template"),
    _        = require("../../../utils"),
    JSONPointerTemplate;

/**
 * JSONPointerTemplate
 *
 * @class
 * @extends Template
 */
JSONPointerTemplate = Template.extend(
    /**
     * @lends HypnofrogTemplate.prototype
     */
    {
        define: function(match) {
            return {
                path:    match[1],
                pointer: match[2]
            };
        }
    },

    {
        /**
         * Template for checking reference to the DM.
         *
         * @type {RegExp}
         * @private
         * @static
         */
        REGEXP: /^([^#]+)#([^#]*)$/i
    }
);

module.exports = JSONPointerTemplate;