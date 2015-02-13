var ServiceTemplate = require("../service"),
    _      = require("../../../../utils"),
    LiveServiceTemplate;

/**
 * LiveServiceTemplate
 *
 * @class LiveServiceTemplate
 * @extends ServiceTemplate
 * @author Sergey Kamardin <s.kamardin@tcsbank.ru>
 */
LiveServiceTemplate = ServiceTemplate.extend(
    /**
     * @lends LiveServiceTemplate.prototype
     */
    {
        // empty
    },
    {
        /**
         * ServiceTemplate for checking reference to property in string context.
         *
         * @type {RegExp}
         * @private
         * @static
         */
        REGEXP: /@\{([^:]+)(?::([^\[\]]+)(\[.*\])?)?\}/gi
    }
);

module.exports = LiveServiceTemplate;