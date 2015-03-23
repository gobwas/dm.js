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
        REGEXP: /@\{([a-zA-Z_$][0-9a-zA-Z_$\.\-]*)(?::([^\[\]]+)(\[.*\])?)?\}/gi
    }
);

module.exports = LiveServiceTemplate;