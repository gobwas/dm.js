var ResourceTemplate = require("../resource"),
    _      = require("../../../../utils"),
    LiveResourceTemplate;

/**
 * LiveResourceTemplate
 *
 * @class LiveResourceTemplate
 * @extends ResourceTemplate
 * @author Sergey Kamardin <s.kamardin@tcsbank.ru>
 */
LiveResourceTemplate = ResourceTemplate.extend(
    /**
     * @lends LiveResourceTemplate.prototype
     */
    {
        // empty
    },
    {
        /**
         * ResourceTemplate for checking reference to property in string context.
         *
         * @type {RegExp}
         * @private
         * @static
         */
        REGEXP: /#\{(?:([^!]+)!)?(.*)\}/gi
    }
);

module.exports = LiveResourceTemplate;