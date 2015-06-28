var ServiceTemplate = require("../service"),
    _      = require("../../../../utils"),
    DeferredServiceTemplate;

/**
 * DeferredServiceTemplate
 *
 * @class DeferredServiceTemplate
 * @extends ServiceTemplate
 * @author Sergey Kamardin <s.kamardin@tcsbank.ru>
 */
DeferredServiceTemplate = ServiceTemplate.extend(
    /**
     * @lends DeferredServiceTemplate.prototype
     */
    {
        // empty
    },
    {
        /**
         * Template for checking reference to the service.
         *
         * Could be applied to string in format:
         * &@<service>[:<method>[\[<argument-1>,[<argument-n>]\]]]
         *
         * @type {RegExp}
         * @private
         * @static
         */
        REGEXP: /^&@([a-zA-Z_$][0-9a-zA-Z_$\.\-]*)(?::([^\[\]]+)(\[.*\])?)?$/i

    }
);

module.exports = DeferredServiceTemplate;