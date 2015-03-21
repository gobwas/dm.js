var Template = require("../template"),
    _        = require("../../../utils"),
    HypnofrogTemplate;

/**
 * HypnofrogTemplate
 *
 * @class
 * @extends Template
 */
HypnofrogTemplate = Template.extend(
    /**
     * @lends HypnofrogTemplate.prototype
     */
    {
        define: function() {
            return {};
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
        REGEXP: /^@_@$/i
    }
);

module.exports = HypnofrogTemplate;