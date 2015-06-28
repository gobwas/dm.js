var ResourceTemplate = require("../resource"),
    _      = require("../../../../utils"),
    DeferredResourceTemplate;

/**
 * DeferredResourceTemplate
 *
 * @class DeferredResourceTemplate
 * @extends ResourceTemplate
 * @author Sergey Kamardin <s.kamardin@tcsbank.ru>
 */
DeferredResourceTemplate = ResourceTemplate.extend(
    /**
     * @lends DeferredResourceTemplate.prototype
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
        REGEXP: /^&#(?:([^!]+)!)?(.*)#$/i
    }
);

module.exports = DeferredResourceTemplate;