var ParameterTemplate = require("../parameter"),
    _        = require("../../../../utils"),
    LiveParameterTemplate;

/**
 * LiveParameterTemplate
 *
 * @class LiveParameterTemplate
 * @extends ParameterTemplate
 * @author Sergey Kamardin <s.kamardin@tcsbank.ru>
 */
LiveParameterTemplate = ParameterTemplate.extend(
    /**
     * @lends LiveParameterTemplate.prototype
     */
    {
        // empty
    },
    {
        /**
         * Template for checking reference to property in string context.
         *
         * @type {RegExp}
         * @private
         * @static
         */
        REGEXP: /%\{([^%]+?)\}/gi
    }
);

module.exports = LiveParameterTemplate;